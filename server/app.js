import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/user.routes.js';
import chatRoute from './routes/chat.routes.js';
import adminRoute from './routes/admin.routes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import { v4 as uuid } from 'uuid';
import { Message } from './models/messages.models.js';

dotenv.config({
    path: './.env',
});


const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV || 'DEVELOPMENT';
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "admin123";
const userSocketIDs = new Map();

connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    credentials: true,
}));


app.use('/api/v1/user', userRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/admin', adminRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.use((socket, next) => {});
io.on('connection', (socket) => {
    const user = {
        _id:"aec",
        name: "Admin",
    }
    userSocketIDs.set(user._id.toString(), socket.id);
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
            console.log(error);
        }
    });
    socket.on('disconnect', (msg) => {
        console.log("user disconnected");
        userSocketIDs.delete(user._id.toString());
    })
});
app.use(errorMiddleware);

server.listen(port, () => {
    console.log(`Server running on port ${port} in ${envMode} mode`);
});

export { adminSecretKey, envMode , userSocketIDs};