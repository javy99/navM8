import * as express from 'express'
import { requireAuth } from '../middlewares'
import { getAllMessages, sendMessage } from '../controllers'


const messageRouter = express.Router()

messageRouter.post('/', requireAuth, sendMessage)
messageRouter.get('/:chatId', requireAuth, getAllMessages)

export default messageRouter
