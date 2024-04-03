import * as express from 'express'
import * as multer from 'multer'
import { requireAuth } from '../middlewares'
import { getAllTours, getMyTours, createTour, getTour } from '../controllers'

const toursRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

toursRouter.get('/', getAllTours)
toursRouter.post('/mytours', requireAuth, upload.array('photos'), createTour)
toursRouter.get('/mytours', requireAuth, getMyTours)
toursRouter.get('/:id', requireAuth, getTour)

export default toursRouter
