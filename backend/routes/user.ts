import * as express from 'express'
import * as multer from 'multer'
import requireAuth from '../middlewares/requireAuth'
import {
  loginUser,
  signupUser,
  updateProfile,
} from '../controllers/userController'
import createTour from '../controllers/tourController'
import Tour from '../models/tourModel'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.patch('/profile', requireAuth, updateProfile)
router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user)
})
router.post('/mytours', requireAuth, upload.array('photos'), createTour)
router.get('/mytours', requireAuth, async (req, res) => {
  try {
    // Assuming there's a field in the Tour model that references the user's ID, such as `author`
    const userTours = await Tour.find({ author: req.user._id })
      .populate('author') // prints all author data!
      .exec()

    res.json(userTours)
  } catch (error) {
    console.error('Error fetching user tours:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
