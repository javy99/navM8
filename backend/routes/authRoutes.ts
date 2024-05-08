import * as express from 'express'
import {
  loginUser,
  signupUser,
  getUser,
  logoutUser,
  refreshToken,
} from '../controllers'
import { requireAuth } from '../middlewares'

const authRouter = express.Router()

authRouter.post('/signup', signupUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
authRouter.get('/refresh_token', refreshToken)
authRouter.get('/user', requireAuth, getUser)

export default authRouter