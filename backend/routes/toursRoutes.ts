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
} from '../controllers'

const toursRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

toursRouter.get('/', getAllTours)
toursRouter.post('/mytours', requireAuth, upload.array('photos'), createTour)
toursRouter.put('/mytours/:id', requireAuth, upload.array('photos'), updateTour)
toursRouter.delete('/mytours/:id', requireAuth, deleteTour)
toursRouter.get('/mytours', requireAuth, getMyTours)
toursRouter.get('/:id', getTour)

export default toursRouter
