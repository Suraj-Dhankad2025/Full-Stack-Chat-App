import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.middleware.js';
import { User } from '../models/user.models.js';
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { Chat } from '../models/chat.models.js';
import { Request } from '../models/request.models.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
const newUser = TryCatch(async (req, res, next) => {
    const { name, username, password, bio } = req.body;
    if(!req.file){
        return next(new ErrorHandler("Please upload an avatar", 400));
    }
    const result = await uploadFilesToCloudinary([req.file]);
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };
    const user = {
        name,
        bio,
        username,
        password,
        avatar,
    }
    await User.create(user);

    sendToken(res, user, 201, 'User created successfully');
});

const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 404));
    }
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Credentials", 404));
    }
    sendToken(res, user, 201, `Welcome back ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
})
const logout = TryCatch(async (req, res) => {
    res.status(200).cookie('chat-token', "", { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: "Logged out successfully",
    });
})

const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    const allUsersFromMyChats = myChats.map(chat => chat.members).flat();

    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: 'i' },
    });
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url
    }));
    return res.status(200).json({
        success: true,
        users,
    });
});

const sendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;
    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    });

    if (request) {
        return next(new ErrorHandler("Request already sent", 400));
    }
    await Request.create({
        sender: req.user,
        receiver: userId,
    });
    emitEvent(req, NEW_REQUEST, [userId]);
    res.status(200).json({
        success: true,
        data: "Friend request sent",
    });
});

const acceptRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;
    const request = await Request.findById(requestId)
        .populate('sender', 'name')
        .populate('receiver', 'name');
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }
    if (request.receiver._id.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are Unauthorized to accept this request", 401));
    }
    if (!accept) {
        await request.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Request rejected",
        });
    }
    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name}-${request.receiver.name}`,
        }),
        request.deleteOne(),
    ]);
    emitEvent(req, REFETCH_CHATS, members);
    res.status(200).json({
        success: true,
        message: "Friend request accepted",
        senderId: request.sender._id,
    });
})

const getMyNotifications = TryCatch(async (req, res) => {
    const requests = await Request.find({ receiver: req.user })
        .populate('sender', 'name avatar');

    const allRequest = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        }
    }));
    res.status(200).json({
        success: true,
        allRequest,
    });
});

const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;
    const chats = await Chat.find({
        members: req.user,
        groupChat: false
    }).populate('members', 'name avatar');
    const friends = chats.map(({ members }) => {
        const otherUsers = getOtherMembers(members, req.user);
        return {
            _id: otherUsers._id,
            name: otherUsers.name,
            avatar: otherUsers.avatar.url,
        };
    });
    if(chatId){
        const chat = await Chat.findById(chatId);
        const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id));
        res.status(200).json({
            success: true,
            friends:availableFriends
        });
    }else{
        res.status(200).json({
            success: true,
            friends,
        });
    }
});

export {
    login,
    newUser,
    getMyProfile,
    logout,
    searchUser,
    sendRequest,
    acceptRequest,
    getMyNotifications,
    getMyFriends,
}; 