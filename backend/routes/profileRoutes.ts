import * as express from 'express'
import * as multer from 'multer'
import { requireAuth } from '../middlewares'
import {
  updateProfile,
  getProfile,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
} from '../controllers'

const profileRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

profileRouter.patch('/', requireAuth, updateProfile)
profileRouter.get('/', requireAuth, getProfile)
profileRouter.post(
  '/photo',
  requireAuth,
  upload.single('profilePictureURL'),
  uploadProfilePhoto,
)
profileRouter.get('/photo', requireAuth, getProfilePhoto)
profileRouter.delete('/photo', requireAuth, deleteProfilePhoto)

export default profileRouter
