import * as express from 'express'
import { requireAuth } from '../middlewares'
import { getAllMessages, sendMessage } from '../controllers'

const messageRouter = express.Router()

messageRouter.use(requireAuth)

messageRouter.post('/', sendMessage)
messageRouter.get('/:chatId', getAllMessages)

export default messageRouter
