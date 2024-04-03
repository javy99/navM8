import * as express from 'express'
import * as multer from 'multer'
import { requireAuth } from '../middlewares'
import {
  updateProfile,
  getProfile,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
  getAllUsers,
  addFavoriteTour,
  deleteFavoriteTour,
  getFavoriteTours,
} from '../controllers'

const userRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

userRouter.get('/', requireAuth, getAllUsers)

userRouter.patch('/:id', requireAuth, updateProfile)
userRouter.get('/:id', requireAuth, getProfile)

userRouter.post(
  '/:id/photo',
  requireAuth,
  upload.single('profilePictureURL'),
  uploadProfilePhoto,
)
userRouter.get('/:id/photo', requireAuth, getProfilePhoto)
userRouter.delete('/:id/photo', requireAuth, deleteProfilePhoto)

userRouter.post('/:id/favoriteTours', requireAuth, addFavoriteTour)
userRouter.get('/:id/favoriteTours', requireAuth, getFavoriteTours)
userRouter.delete('/:id/favoriteTours/:tourId', requireAuth, deleteFavoriteTour)

export default userRouter
