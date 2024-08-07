import cookieParser from 'cookie-parser';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from './constants/events.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { Message } from './models/messages.models.js';
import { connectDB } from './utils/features.js';
import { corsOptions } from './constants/config.js';
import { socketAuthenticator } from './middlewares/auth.middleware.js';
import { getSockets } from './lib/helper.lib.js';

import adminRoute from './routes/admin.routes.js';
import chatRoute from './routes/chat.routes.js';
import userRoute from './routes/user.routes.js';
import { User } from './models/user.models.js';


dotenv.config({
    path: './.env.local',
});


const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV || 'DEVELOPMENT';
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "admin123";
const userSocketIDs = new Map();
const onlineUsers = new Set();

connectDB();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

app.set('io', io);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/api/v1/user', userRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/admin', adminRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.use((socket, next) => {
    cookieParser()(
        socket.request, 
        socket.request.res, 
        async (error)=> await socketAuthenticator(error, socket, next)
    );
});

io.on('connection', async (socket) => {
    const userId = socket.user._conditions._id;
    const user = await User.findById(userId);
    userSocketIDs.set(user?._id?.toString(), socket.id);
    socket.on(NEW_MESSAGE, async ({chatId, members, message}) => {
        const messageForReatTime = {
            content:message,
            _id:uuid(),
            sender:{
                _id: user._id,
                name: user.name,
            },
            chat:chatId,
            createdAt: new Date().toISOString(),
        }
        const messageForDB = {
            content:message,
            sender:user._id,
            chat:chatId,
        }
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForReatTime,
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {chatId});

        try {
            await Message.create(messageForDB);
        } catch (error) {
            throw new Error(error);
        }
    });
    socket.on(START_TYPING, ({members, chatId}) => {
        const membersSocket = getSockets(members);
        socket.to(membersSocket).emit(START_TYPING, {chatId});
    });
    socket.on(STOP_TYPING, ({members, chatId}) => {
        const membersSocket = getSockets(members);
        socket.to(membersSocket).emit(STOP_TYPING, {chatId});
    });
    socket.on(CHAT_JOINED, ({userId, members}) => {
        onlineUsers.add(userId.toString());
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });
    socket.on(CHAT_LEFT, ({userId, members}) => {
        onlineUsers.delete(userId.toString());
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });
    socket.on('disconnect', () => {
        console.log("user disconnected");
        userSocketIDs.delete(user?._id?.toString());
        onlineUsers.delete(user?._id?.toString());
        socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
    })
});
app.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server running on port ${port} in ${envMode} mode`);
});

export { adminSecretKey, envMode, userSocketIDs };
