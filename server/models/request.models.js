import moogoose, { Schema, Types, model } from 'mongoose';

const requestSchema = new Schema({
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    receiver: {
        type: Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export const Request = moogoose.models.Request || model('Request', requestSchema); 