import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.lib.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { Chat } from "../models/chat.models.js";
import { Message } from "../models/messages.models.js";
import { User } from "../models/user.models.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body;
    const allMembers = [...members, req.user];

    await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers
    });
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
        success: true,
        message: "Group created"
    })
});

const getMyChats = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({ members: req.user._id }).populate('members', 'name avatar');
    const otherMember = getOtherMember(members, req.user);
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
            name: groupChat ? name : otherMember.name,
            members: members.reduce((acc, curr) => {
                if (curr._id.toString() !== req.user.toString()) {
                    acc.push(curr._id);
                }
                return acc;
            }, [])
        }
    });
    return res.status(200).json({
        success: true,
        chats: transformedChats
    })
});

const getMyGroups = TryCatch(async (req, res, next) => {
    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user
    }).populate('members', 'name avatar');

    const groups = chats.map(({ _id, name, members, groupChat }) => {
        return {
            _id,
            groupChat,
            name,
            avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
        }
    });
    return res.status(200).json({
        success: true,
        groups
    })
});

const addMembers = TryCatch(async (req, res, next) => {
    const { members, chatId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }
    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not allowed to add members", 403));
    }
    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
    const allNewMembers = await Promise.all(allNewMembersPromise);

    const uniqueMembers = allNewMembers
        .filter(({ _id }) => !chat.members.includes(_id.toString()))
        .map(({ _id }) => _id);

    chat.members.push(uniqueMembers);


    if (chat.members.length > 100) {
        return next(new ErrorHandler("Group members limit reached", 400));
    }
    await chat.save();

    const allUsersName = allNewMembers.map(({ name }) => name).join(",");
    emitEvent(req, ALERT, chat.members, `${allUsersName} has been added to group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Members added Successfully"
    })
});

const removeMember = TryCatch(async (req, res, next) => {
    const { userId, chatId } = req.body;
    const [chat, userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId, "name")
    ]);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }
    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not allowed to remove members", 403));
    }
    if (chat.members.length <= 3) {
        return next(new ErrorHandler("Group must have at least 3 members", 400));
    }
    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
    );
    await chat.save();
    emitEvent(req, ALERT, chat.members, `${userThatWillBeRemoved.name} has been removed from group`);
    emitEvent(req, REFETCH_CHATS, chat.members);
    return res.status(200).json({
        success: true,
        message: "Member removed successfully"
    });
});

const leaveGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }
    const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString()
    );
    if (remainingMembers.length < 3) {
        return next(new ErrorHandler("Group must have at least 3 members", 400
        ));
    }
    if (chat.creator.toString() === req.user.toString()) {
        const newCreator = remainingMembers[0];
        chat.creator = newCreator;
    }
    chat.members = remainingMembers;
    const [user] = Promise.all([
        User.findById(req.user, "name"),
        chat.save()
    ]);
    emitEvent(req, ALERT, chat.members, `${user.name} has left the group`);

    return res.status(200).json({
        success: true,
        message: `${user.name} has left the group`
    });
});

const sendAttachments = TryCatch(async (req, res, next) => {
    const { chatId } = req.body;
    const files = req.files || [];
    if(files.length < 1){
        return next(new ErrorHandler("Please provide attachments", 400));
    }
    if(files.length > 5){
        return next(new ErrorHandler("You can only upload 5 files at a time", 400));
    }
    const [chat, me] = Promise.all([
        Chat.findById(chatId),
        User.findById(req.user, "name")
    ]);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    if (files.length < 1) {
        return next(new ErrorHandler("Please provide attachments", 400));
    }
    const attachments = await uploadFilesToCloudinary(files);
    const messageForRealTime = {
        content: "",
        attachments,
        sender: {
            _id: me._id,
            name: me.name
        },
        chat: chatId
    };
    const messageForDB = {
        content: "",
        attachments,
        sender: req.user,
        chat: chatId
    };
    const message = await Message.create(messageForDB);
    emitEvent(req, NEW_ATTACHMENT, chat.members, {
        message: messageForRealTime,
        chatId
    });
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
    return res.status(200).json({
        success: true,
        message,
    });
});

const getChatDetails = TryCatch(async (req, res, next) => {
    if (req.query.populate === 'true') {
        const chat = await Chat.findById(req.params.id)
            .populate('members', 'name avatar')
            .lean();

        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        chat.members = chat.members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url
        }));
        return res.status(200).json({
            success: true,
            chat
        });
    }
    else {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        return res.status(200).json({
            success: true,
            chat
        });
    }
});

const renameGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { name } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }
    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not allowed to rename group", 403));
    }
    chat.name = name;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Group renamed successfully"
    });
});

const deleteChat = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    const members = chat.members;
    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not allowed to delete group chat", 403));
    }
    if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler("You are not allowed to delete chat", 403));
    }

    const messageWithAttachments = await Message.find({ chat: chatId, attachments: { $exists: true, $ne: [] } });
    const public_ids = [];
    messageWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(({ public_id }) => {
            public_ids.push(public_id);
        });
    });
    await Promise.all([
        deleteFilesFromCloudinary(public_ids),
        chqt.deleteOne(),
        Message.deleteMany({ chat: chatId })
    ]);
    emitEvent(req, REFETCH_CHATS, members);
    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully"
    });
});

const getMessages = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [messages, totalMessagesCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'name')
            .lean(),
        Message.countDocuments({ chat: chatId }),
    ]);
    const totalPages = Math.ceil(totalMessagesCount / limit);
    return res.status(200).json({
        success: true,
        messages: messages.reverse(),
        totalPages,
    });
});
export {
    newGroupChat,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMember,
    leaveGroup,
    sendAttachments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
};