import * as express from 'express'
import { loginUser, signupUser } from '../controllers'
import { logoutUser, refreshToken } from '../controllers/authControllers'

const authRouter = express.Router()

authRouter.post('/signup', signupUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
authRouter.get('/refresh_token', refreshToken)

export default authRouter
