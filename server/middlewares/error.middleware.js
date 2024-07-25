const errorMiddleware = (error, req, res, next) => {
    error.message = error.message || "Internal Server Error";
    error.statusCode = error.statusCode || 500;
    return res.status(error.statusCode).json({
        success: false,
        message: error.message,
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