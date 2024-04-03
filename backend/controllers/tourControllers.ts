import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { Request, Response } from 'express'
import { Tour } from '../models'

dotenv.config()

interface MulterRequest extends Request {
  files: Express.Multer.File[]
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadTourImageToCloudinary(filePath: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'tourPhotos',
    })
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary Upload Error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find().populate('author').exec()
    res.json(tours)
  } catch (error) {
    console.error('Error fetching tours:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const createTour = async (req: MulterRequest, res: Response) => {
  try {
    const {
      name,
      country,
      city,
      maxPeople,
      typeOfAvailability,
      availability,
      date,
      from,
      to,
      description,
    } = req.body

    const files = req.files ?? []
    const imageUrls = await Promise.all(
      files.map((file) => uploadTourImageToCloudinary(file.path)),
    )

    const tour = new Tour({
      name,
      country,
      city,
      maxPeople,
      typeOfAvailability,
      availability,
      date,
      from,
      to,
      description,
      photos: imageUrls,
      author: req.user._id,
    })

    await tour.save()
    res.status(201).json(tour)
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const getMyTours = async (req: Request, res: Response) => {
  try {
    const userTours = await Tour.find({ author: req.user._id })
      .populate('author')
      .exec()

    res.json(userTours)
  } catch (error) {
    console.error('Error fetching user tours:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export { getAllTours, createTour, getMyTours }
