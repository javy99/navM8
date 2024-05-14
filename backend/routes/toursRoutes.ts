import * as express from 'express'
import * as multer from 'multer'
import { requireAuth } from '../middlewares'
import {
  getAllTours,
  getMyTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getUserTours,
} from '../controllers'

const toursRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

toursRouter.get('/', getAllTours)

toursRouter.use(requireAuth)

toursRouter.post('/mytours', upload.array('photos'), createTour)
toursRouter.put('/mytours/:id', upload.array('photos'), updateTour)
toursRouter.delete('/mytours/:id', deleteTour)
toursRouter.get('/mytours', getMyTours)
toursRouter.get('/:id', getTour)
toursRouter.get('/user/:id', getUserTours)

export default toursRouter
