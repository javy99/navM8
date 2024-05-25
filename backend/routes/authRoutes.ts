import express from 'express'
import {
  loginUser,
  signupUser,
  getUser,
  logoutUser,
  refreshTokenHandler,
} from '../controllers'
import { requireAuth } from '../middlewares'

const authRouter = express.Router()

authRouter.post('/signup', signupUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', requireAuth, logoutUser)
authRouter.post('/refresh_token', requireAuth, refreshTokenHandler)
authRouter.get('/user', requireAuth, getUser)

export default authRouter
