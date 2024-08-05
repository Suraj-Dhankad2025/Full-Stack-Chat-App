import { TryCatch } from "./error.middleware.js";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { User } from "../models/user.models.js";
const isAdmin = TryCatch(async (req, res, next) => {
    const token = req.cookies["chat-admin-token"];
    if (!token) {
        return next(new ErrorHandler("Only admin can access this route", 401));
    }
    const secretKey = jwt.verify(token, process.env.JWT_SECRET);
    const isMatched = secretKey === adminSecretKey;
    if(!isMatched){
        return next(new ErrorHandler("Invalid Admin Key", 401));
    }
    next();
});

const isAuthenticated = TryCatch(async (req, res, next) => {
    const token = req.cookies["chat-token"];
    if (!token) {
        return next(new ErrorHandler("Please login to access this route", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeData.id;
    next();
});

const socketAuthenticator = async(error, socket, next) => {
    try {
        if(error) return next(error);
        const authToken = socket.request.cookies["chat-token"];
        if(!authToken) return next(new ErrorHandler("Please login to access this route", 401));
        const decodeData = jwt.verify(authToken, process.env.JWT_SECRET);
        const user = User.findById(decodeData._id);
        if(!user) return next(new ErrorHandler("Please login to access this route", 401));
        socket.user = user;
        return next();
    } catch (error) {
        return next(new ErrorHandler("Please login to access this route", 401));
    }
}
export { isAuthenticated, isAdmin, socketAuthenticator };