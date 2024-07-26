import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { attachmentsMulter } from '../middlewares/multer.middleware.js';
import {
    addMembers,
    deleteChat,
    getChatDetails,
    getMessages,
    getMyChats,
    getMyGroups,
    leaveGroup,
    newGroupChat,
    removeMember,
    renameGroup,
    sendAttachments
} from '../controllers/chat.controller.js';
import {
    addMemberValidator,
    getChatDetailsvalidator,
    getMessagesValidator,
    leaveGroupValidator,
    newGroupValidator,
    removeMemberValidator,
    renameValidator,
    sendAttachmentsValidator,
    validateHandler
} from '../lib/validators.lib.js';

const app = express.Router();


app.use(isAuthenticated);
//All the below routes are protected
app.post('/new', newGroupValidator(), validateHandler, newGroupChat);

app.get('/my', getMyChats);

app.get('/my/groups', getMyGroups);

app.put('/addMembers', addMemberValidator(), validateHandler, addMembers);

app.put('/removeMember', removeMemberValidator(), validateHandler, removeMember);

app.delete('/leave/:id', leaveGroupValidator(), validateHandler, leaveGroup);

app.post('/message', attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);

app.get('/message/:id', getMessagesValidator(), validateHandler, getMessages);

app.route('/:id')
    .get(getChatDetailsvalidator(), validateHandler, getChatDetails)
    .put(renameValidator(), validateHandler, renameGroup)
    .delete(getChatDetailsvalidator(), validateHandler,deleteChat);


export default app;