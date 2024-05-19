"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authControllers_1 = require("../controllers/authControllers");
const requireAuth = async (req, res, next) => {
    const { token } = req.cookies;
    const { refreshToken } = req.cookies;
    if (!token && !refreshToken) {
        return res.status(401).json({ error: 'Authorization token required' });
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT secret is not defined.');
        }
        // Verify the access token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError && refreshToken) {
                const refreshDecoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
                const newToken = (0, authControllers_1.createToken)(refreshDecoded._id.toString(), '3d');
                // Set the new access token in the response cookies
                res.cookie('token', newToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3 * 24 * 60 * 60 * 1000,
                });
                // Decode the new access token
                decoded = jsonwebtoken_1.default.verify(newToken, JWT_SECRET);
            }
            else {
                throw error;
            }
        }
        // Find the user based on the decoded token
        const user = await models_1.User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Request is not authorized' });
    }
};
exports.default = requireAuth;
//# sourceMappingURL=requireAuth.js.map