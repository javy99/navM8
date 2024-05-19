import { Request, Response } from 'express'
import { Chat, IMessage, Message } from '../models'

const sendMessage = async (req: Request, res: Response) => {
  const { content, chatId } = req.body

  if (!content || !chatId) {
    return res.status(400).json({ message: 'Invalid data passed into request' })
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  }

  try {
    let message: IMessage = await Message.create(newMessage)

    message = await Message.findById(message._id).populate(
      'sender',
      'firstName lastName profilePictureURL email username',
    )
    message = await Message.populate(message, {
      path: 'chat',
      populate: {
        path: 'users',
        select: 'firstName lastName profilePictureURL email username',
      },
    })

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    })

    return res.status(200).json(message)
  } catch (error) {
    return res.status(400).json({ message: 'Error sending message' })
  }
}

const getAllMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params

  if (!chatId) {
    return res.status(400).json({ message: 'Invalid data passed into request' })
  }

  try {
    const messages = await Message.find({ chat: chatId }).populate(
      'sender',
      'firstName lastName profilePictureURL email username',
    )

    return res.status(200).json(messages)
  } catch (error) {
    return res.status(400).json({ message: 'Error fetching messages' })
  }
}

export { sendMessage, getAllMessages }
