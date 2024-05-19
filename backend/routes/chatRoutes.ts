import express from 'express'
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
chatRouter.put('/group/rename', renameGroup)
chatRouter.put('/group/removeUser', removeFromGroup)
chatRouter.put('/group/addUser', addToGroup)

export default chatRouter
