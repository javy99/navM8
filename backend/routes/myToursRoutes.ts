import * as express from 'express'
import * as multer from 'multer'
import { requireAuth } from '../middlewares'
import { getMyTours, createTour } from '../controllers'

const myToursRouter = express.Router()
const upload = multer({ dest: 'uploads/' })

myToursRouter.post('/', requireAuth, upload.array('photos'), createTour)
myToursRouter.get('/', requireAuth, getMyTours)

export default myToursRouter
