"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromGroup = exports.addToGroup = exports.renameGroup = exports.createGroupChat = exports.getChats = exports.accessChat = void 0;
const models_1 = require("../models");
const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'User ID missing from request.' });
        return;
    }
    let isChat = await models_1.Chat.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate('users', '-password')
        .populate('latestMessage');
    isChat = await models_1.User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'firstName lastName profilePictureURL email',
    });
    if (isChat) {
        res.send(isChat);
    }
    else {
        const chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await models_1.Chat.create(chatData);
            const fullChat = await models_1.Chat.findById(createdChat._id).populate('users', '-password');
            res.status(200).send(fullChat);
        }
        catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
};
exports.accessChat = accessChat;
const getChats = async (req, res) => {
    try {
        models_1.Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
            const populatedResults = await models_1.User.populate(results, {
                path: 'latestMessage.sender',
                select: 'firstName lastName profilePictureURL email',
            });
            res.status(200).send(populatedResults);
        });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};
exports.getChats = getChats;
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ error: 'Please provide all fields' });
    }
    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send({ error: 'Please provide at least 2 users' });
    }
    users.push(req.user);
    try {
        const groupChat = await models_1.Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users,
            groupAdmin: req.user,
        });
        const fullGroupChat = await models_1.Chat.findOne({
            _id: groupChat._id,
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');
        res.status(200).send(fullGroupChat);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};
exports.createGroupChat = createGroupChat;
const renameGroup = async (req, res) => {
    if (!req.body.chatId || !req.body.chatName) {
        return res.status(400).send({ error: 'Please provide all fields' });
    }
    const { chatId, chatName } = req.body;
    try {
        const chat = await models_1.Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');
        res.status(200).send(chat);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};
exports.renameGroup = renameGroup;
const addToGroup = async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        return res.status(400).send({ error: 'Please provide all fields' });
    }
    const { chatId, userId } = req.body;
    try {
        const chat = await models_1.Chat.findByIdAndUpdate(chatId, { $addToSet: { users: userId } }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');
        res.status(200).send(chat);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};
exports.addToGroup = addToGroup;
const removeFromGroup = async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        return res.status(400).send({ error: 'Please provide all fields' });
    }
    const { chatId, userId } = req.body;
    try {
        const chat = await models_1.Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');
        res.status(200).send(chat);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};
exports.removeFromGroup = removeFromGroup;
//# sourceMappingURL=chatControllers.js.map