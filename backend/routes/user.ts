import * as express from 'express'
import * as multer from 'multer'
import requireAuth from '../middlewares/requireAuth'
import {
  loginUser,
  signupUser,
  updateProfile,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
} from '../controllers/userController'
import createTour from '../controllers/tourController'
import Tour from '../models/tourModel'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.patch('/profile', requireAuth, updateProfile)
router.post(
  '/profile/photo',
  requireAuth,
  upload.single('profilePictureURL'),
  uploadProfilePhoto,
)

router.get('/profile/photo', requireAuth, getProfilePhoto)
router.delete('/profile/photo', requireAuth, deleteProfilePhoto)

router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user)
})
router.post('/mytours', requireAuth, upload.array('photos'), createTour)
router.get('/mytours', requireAuth, async (req, res) => {
  try {
    const userTours = await Tour.find({ author: req.user._id })
      .populate('author')
      .exec()

    res.json(userTours)
  } catch (error) {
    console.error('Error fetching user tours:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
