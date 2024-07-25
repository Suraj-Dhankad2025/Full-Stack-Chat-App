import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then((data) => {
            console.log(`MongoDB Connected: ${data.connection.host}`);
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    httpOnly: true,
    secure: true,
}
const sendToken = async (res, user, code, message) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(code).cookie('chat-token', token, cookieOptions  ).json({
        success: true,
        message
    });
};

export {connectDB, sendToken, cookieOptions};