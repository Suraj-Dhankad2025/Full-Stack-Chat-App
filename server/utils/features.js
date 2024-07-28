import mongoose, { get } from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helper.lib";
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
    return res.status(code).cookie('chat-token', token, cookieOptions).json({
        success: true,
        message
    });
};

const emitEvent = (req, event, users, data) => {
    console.log("Emitting event");
}

const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
        });
    });
    try {
        const result = await Promise.all(uploadPromises);
        const formattedResult = result.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResult;
    } catch (error) {
        throw new Error("Error in uploading files in cloudinary", error);
    }
}

const deleteFilesFromCloudinary = async (public_ids) => {
    console.log("Deleting files from cloudinary");
}

export {
    connectDB,
    sendToken,
    cookieOptions,
    emitEvent,
    deleteFilesFromCloudinary,
    uploadFilesToCloudinary
};