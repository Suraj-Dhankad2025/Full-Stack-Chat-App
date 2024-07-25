import { compare } from 'bcrypt';
import { TryCatch } from '../middlewares/error.middleware.js';
import { User } from '../models/user.models.js';
import { cookieOptions, sendToken } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';

const newUser = async (req, res) => {
    const { name, username, password, bio } = req.body;
    const avatar = {
        public_id: "abc",
        url: "abc",
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
};
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

const getMyProfile = TryCatch( async (req, res) => { 
    const user = await User.findById(req.user);
    res.status(200).json({
        success: true,
        data: user,
    });
})
const logout = TryCatch( async (req, res) => { 
    res.status(200).cookie('chat-token',"", {...cookieOptions, maxAge: 0}).json({
        success: true,
        message: "Logged out successfully",
    });
})
export { login, newUser, getMyProfile, logout }; 