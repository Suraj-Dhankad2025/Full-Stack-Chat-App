import { TryCatch } from '../middlewares/error.middleware.js';
import { User } from '../models/user.models.js';
import { Chat } from '../models/chat.models.js';
import { Message } from '../models/messages.models.js';
import { ErrorHandler } from '../utils/utility.js';
import jwt from 'jsonwebtoken';
import {cookieOptions} from '../utils/features.js';
import { adminSecretKey } from '../app.js';

const adminLogin = TryCatch(async (req, res, next) => {
    const { secretKey} = req.body;
    if (secretKey !== adminSecretKey) {
        return next(new ErrorHandler('Invalid Admin key', 401));
    }
    const token = jwt.sign(secretKey, process.env.JWT_SECRET);
    return res.status(200).cookie('chat-admin-token', token, {...cookieOptions, maxAge:1000*60*15}).json({
        success: true,
        message:"Authenticated Successfully",
    });
});

const adminLogout = TryCatch(async (req, res, next) => {
    return res.status(200).cookie('chat-admin-token', "", {...cookieOptions, maxAge:0}).json({
        success: true,
        message:"Logged out Successfully",
    });
});

const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find({});

    const transformUsers = await Promise.all(
        users.map(async ({ name, username, avatar, _id }) => {
        const [groups,friends] = await Promise.all([
            Chat.countDocuments({ groupChat: true, members: _id }),
            Chat.countDocuments({ groupChat: false, members: _id }),
        ])
        return {
            name,
            username,
            avatar: avatar.url,
            _id,
            groups, 
            friends,
        };
    }))
    return res.status(200).json({
        success: true,
        users: transformUsers,
    });
});

const getAllChats = TryCatch(async (req, res) => {
    const chats = await Chat.find({})
    .populate('members', 'name avatar')
    .populate('creator', 'name avatar');

    const transformChats = await Promise.all(chats.map(async({members, _id, groupChat, name, creator})=>{
        const totalMessages = await Message.countDocuments({ chat: _id });
        return {
            _id,
            groupChat,
            name,
            avatar:members.slice(0,3).map(({avatar})=>avatar.url),
            members: members.map(({_id, name, avatar})=>{
                return {
                    _id,
                    name,
                    avatar: avatar.url,
                };
            }),
            creator: {
                name: creator?.name || 'None',
                avatar: creator.avatar.url || '',
            },
            totalMembers: members.length,
            totalMessages,
        }; 
    }))
    return res.status(200).json({
        success: true,
        chats:transformChats,
    });
});

const getAllMessages = TryCatch(async (req, res) => {
    const messages = await Message.find({})
    .populate('sender', 'name avatar')
    .populate('chat', 'groupChat');

    const transformMessages = messages.map(({_id, chat, sender, content, createdAt, attachments})=>{
        return {
            _id,
            content,
            createdAt,
            attachments,
            chat: chat._id,
            groupChat: chat.groupChat,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            },
        };
    })
    return res.status(200).json({
        success: true,
        messages:transformMessages, 
    });
});

const getDashBoardStats = TryCatch(async (req, res) => {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({groupChat: true}),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ]);

    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lt: today,
        },
    }).select('createdAt');

    const messages = new Array(7).fill(0);
    last7DaysMessages.forEach((message)=>{
        const indexApprox = (today.getTime() - message.createdAt.getTime())/(1000*60*60*24);
        const index = Math.floor(indexApprox);
        messages[6 - index] += 1;
    });

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart:messages
    };
    return res.status(200).json({
        success: true,
        stats,
    });
});

const getAdminData = TryCatch(async (req, res, next) => {
    return res.status(200).json({
        admin: true,
    });
});

export { 
    getAllUsers,
    getAllChats,
    getAllMessages,
    getDashBoardStats,
    adminLogin,
    adminLogout,
    getAdminData,
};