import express from 'express';
import { 
    acceptRequest,
    getMyFriends,
    getMyNotifications,
    getMyProfile, 
    login, 
    logout, 
    newUser, 
    searchUser, 
    sendRequest 
} from '../controllers/user.controller.js';
import { singleAvatar } from '../middlewares/multer.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { 
    acceptRequestValidator, 
    loginValidator, 
    registerValidator, 
    sendRequestValidator, 
    validateHandler 
} from '../lib/validators.lib.js';

const app = express.Router();

app.post('/new', singleAvatar, registerValidator(), validateHandler, newUser);

app.post('/login', loginValidator(), validateHandler, login);

app.use(isAuthenticated);
//All the below routes are protected
app.get('/me', getMyProfile);

app.get('/logout', logout); 

app.get('/search', searchUser);

app.put('/send-request', sendRequestValidator(), validateHandler, sendRequest);

app.put('/accept-request', acceptRequestValidator(), validateHandler, acceptRequest);

app.get('/notifications', getMyNotifications);

app.get('/friends', getMyFriends);

export default app;