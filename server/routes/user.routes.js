import express from 'express';
import { getMyProfile, login, logout, newUser } from '../controllers/user.controller.js';
import { singleAvatar } from '../middlewares/multer.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/login', singleAvatar, login);
app.post('/new', newUser);

app.use(isAuthenticated);
//All the below routes are protected
app.get('/profile', getMyProfile);
app.get('/logout', logout);
app.get('/search', searchUser);
export default app;