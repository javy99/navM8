"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.refreshTokenHandler = exports.logoutUser = exports.signupUser = exports.loginUser = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const createToken = (_id, expiresIn) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return jsonwebtoken_1.default.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn,
    });
};
exports.createToken = createToken;
// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await models_1.User.login(email, password);
        // create tokens
        const token = createToken(user._id.toString(), '3d');
        const refreshToken = createToken(user._id.toString(), '7d');
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ email, token, _id: user._id });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.loginUser = loginUser;
// signup user
const signupUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await models_1.User.signup(username, email, password);
        // create tokens
        const token = createToken(user._id.toString(), '3d');
        const refreshToken = createToken(user._id.toString(), '7d');
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ email, token, _id: user._id });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.signupUser = signupUser;
const logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logoutUser = logoutUser;
// refresh token
const refreshTokenHandler = async (req, res) => {
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    try {
        if (!refreshTokenFromCookie) {
            throw new Error('Refresh token is missing');
        }
        // Verify the refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshTokenFromCookie, process.env.JWT_SECRET);
        // Issue a new access token
        const token = createToken(decoded._id.toString(), '3d');
        // Send the new access token in the response
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.refreshTokenHandler = refreshTokenHandler;
const getUser = async (req, res) => {
    const { token } = req.cookies;
    try {
        if (!req.user) {
            throw new Error('User not found');
        }
        res.json({
            _id: req.user._id,
            email: req.user.email,
            token,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.getUser = getUser;
//# sourceMappingURL=authControllers.js.map