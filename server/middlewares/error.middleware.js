import { envMode } from "../app.js";

const errorMiddleware = (error, req, res, next) => {
    error.message = error.message || "Internal Server Error";
    error.statusCode = error.statusCode || 500;

    if(error.code===11000){
        const err = Object.keys(error.keyPattern).join(",");
        error.message = `Duplicate Field - ${err}`;
        error.statusCode = 400;
    }
    if(error.name==="CastError"){   
        error.message = `Invalid format of ${error.path}`;
        error.statusCode = 400;
    }
    return res.status(error.statusCode).json({
        success: false,
        message: envMode==="DEVELOPMENT" ? error :  error.message,
    });
};

const TryCatch = (passedFunction) => async(req, res, next) =>{
    try {
        await passedFunction(req, res, next);
    } catch (error) {
        next(error);
    }
} 
export { errorMiddleware, TryCatch };