import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/user.routes.js';
import {  connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

dotenv.config({
    path: './.env',
});


const port = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());


app.use('/user', userRoute);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});