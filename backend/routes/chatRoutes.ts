import * as express from 'express'
import { requireAuth } from '../middlewares'
import {
  accessChat,
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from '../controllers'

const chatRouter = express.Router()

chatRouter.post('/', requireAuth, accessChat)
chatRouter.get('/', requireAuth, getChats)
chatRouter.post('/group', requireAuth, createGroupChat)
chatRouter.put('/rename', requireAuth, renameGroup)
chatRouter.put('/groupremove', requireAuth, removeFromGroup)
chatRouter.put('/groupadd', requireAuth, addToGroup)

export default chatRouter
