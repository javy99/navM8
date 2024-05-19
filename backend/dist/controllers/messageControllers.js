"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.sendMessage = void 0;
const models_1 = require("../models");
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return res.status(400).json({ message: 'Invalid data passed into request' });
    }
    const newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
    };
    try {
        let message = await models_1.Message.create(newMessage);
        message = await models_1.Message.findById(message._id).populate('sender', 'firstName lastName profilePictureURL email username');
        message = await models_1.Message.populate(message, {
            path: 'chat',
            populate: {
                path: 'users',
                select: 'firstName lastName profilePictureURL email username',
            },
        });
        await models_1.Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        return res.status(200).json(message);
    }
    catch (error) {
        return res.status(400).json({ message: 'Error sending message' });
    }
};
exports.sendMessage = sendMessage;
const getAllMessages = async (req, res) => {
    const { chatId } = req.params;
    if (!chatId) {
        return res.status(400).json({ message: 'Invalid data passed into request' });
    }
    try {
        const messages = await models_1.Message.find({ chat: chatId }).populate('sender', 'firstName lastName profilePictureURL email username');
        return res.status(200).json(messages);
    }
    catch (error) {
        return res.status(400).json({ message: 'Error fetching messages' });
    }
};
exports.getAllMessages = getAllMessages;
//# sourceMappingURL=messageControllers.js.map