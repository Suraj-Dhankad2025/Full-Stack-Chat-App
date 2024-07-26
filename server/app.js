import express from 'express';
import dotenv from 'dotenv';
import {  connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes.js';
import chatRoute from './routes/chat.routes.js';
import adminRoute from './routes/admin.routes.js';

dotenv.config({
    path: './.env',
});


const port = process.env.PORT || 3000;
const app = express();
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "admin123";

connectDB();

app.use(express.json());
app.use(cookieParser());


app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('admin', adminRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});