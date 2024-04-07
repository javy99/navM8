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

chatRouter.use(requireAuth)

chatRouter.post('/', accessChat)
chatRouter.get('/', getChats)
chatRouter.post('/group', createGroupChat)
chatRouter.put('/rename', renameGroup)
chatRouter.put('/groupremove', removeFromGroup)
chatRouter.put('/groupadd', addToGroup)

export default chatRouter
