import { TryCatch } from "./error.middleware.js";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";

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

export { isAuthenticated, isAdmin };