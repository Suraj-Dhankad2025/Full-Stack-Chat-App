import express from 'express';
import { 
    adminLogin,
    adminLogout,
    getAdminData,
    getAllChats, 
    getAllMessages, 
    getAllUsers, 
    getDashBoardStats 
} from '../controllers/admin.controller.js';
import { adminLoginValidator, validateHandler } from '../lib/validators.lib.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const app = express.Router();


app.post('/verify', adminLoginValidator(), validateHandler, adminLogin);

app.get('/logout', adminLogout);

app.use(isAdmin);
//Only Admin can access the following routes

app.get('/', getAdminData);

app.get('/users', getAllUsers);

app.get('/chats', getAllChats);

app.get('/messages', getAllMessages);

app.get('/stats', getDashBoardStats);

export default app;