import * as express from 'express'
import requireAuth from '../middlewares/requireAuth'
import {
  loginUser,
  signupUser,
  updateProfile,
} from '../controllers/userController'

const router = express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.patch('/profile', requireAuth, updateProfile)
router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user)
})

export default router
