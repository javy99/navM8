import express from 'express'
import multer from 'multer'
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
const storage = multer.memoryStorage()
const upload = multer({ storage })

userRouter.get('/', getAllUsers)

userRouter.use(requireAuth)

userRouter.patch('/:id', updateProfile)
userRouter.get('/:id', getProfile)
userRouter.post(
  '/:id/photo',
  upload.single('profilePictureURL'),
  uploadProfilePhoto,
)
userRouter.get('/:id/photo', getProfilePhoto)
userRouter.delete('/:id/photo', deleteProfilePhoto)
userRouter.post('/:id/favoriteTours', addFavoriteTour)
userRouter.get('/:id/favoriteTours', getFavoriteTours)
userRouter.delete('/:id/favoriteTours/:tourId', deleteFavoriteTour)

export default userRouter
