import { Request, Response } from 'express'
import Chat, { IChat } from '../models/chatModel'
import { IUser, User } from '../models'

const accessChat = async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId) {
    res.status(400).json({ error: 'User ID missing from request.' })
    return
  }

  let isChat: Document | null = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage')

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'firstName lastName profilePictureURL email',
  })

  if (isChat) {
    res.send(isChat)
  } else {
    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    }

    try {
      const createdChat: IChat = await Chat.create(chatData)

      const fullChat: IChat = await Chat.findById(createdChat._id).populate(
        'users',
        '-password',
      )

      res.status(200).send(fullChat)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }
}

const getChats = async (req: Request, res: Response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        const populatedResults = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'firstName lastName profilePictureURL email',
        })

        res.status(200).send(populatedResults)
      })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const createGroupChat = async (req: Request, res: Response) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ error: 'Please provide all fields' })
  }

  let users: IUser[] = JSON.parse(req.body.users)

  if (users.length < 2) {
    return res.status(400).send({ error: 'Please provide at least 2 users' })
  }

  users.push(req.user)

  try {
    const groupChat: IChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    })

    const fullGroupChat: IChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).send(fullGroupChat)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const renameGroup = async (req: Request, res: Response) => {
  if (!req.body.chatId || !req.body.chatName) {
    return res.status(400).send({ error: 'Please provide all fields' })
  }

  const { chatId, chatName } = req.body

  try {
    const chat: IChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).send(chat)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const addToGroup = async (req: Request, res: Response) => {
  if (!req.body.chatId || !req.body.userId) {
    return res.status(400).send({ error: 'Please provide all fields' })
  }

  const { chatId, userId } = req.body

  try {
    const chat: IChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).send(chat)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

const removeFromGroup = async (req: Request, res: Response) => {
  if (!req.body.chatId || !req.body.userId) {
    return res.status(400).send({ error: 'Please provide all fields' })
  }

  const { chatId, userId } = req.body

  try {
    const chat: IChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true },
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password')

    res.status(200).send(chat)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}

export {
  accessChat,
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
}
