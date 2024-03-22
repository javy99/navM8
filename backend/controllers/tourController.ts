import { v2 as cloudinary } from 'cloudinary'
import { Request, Response } from 'express'
import Tour from '../models/tourModel'
import * as dotenv from 'dotenv'

dotenv.config()

interface MulterRequest extends Request {
  files: Express.Multer.File[]
}

// Configure Cloudinary (move to config file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadImageToCloudinary(filePath: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'tourPhotos',
    })
    return result.secure_url // URL of the uploaded image
  } catch (error) {
    console.error('Cloudinary Upload Error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
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

    // Check if `req.files` exists and has files
    const files = req.files ?? []
    const imageUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.path)),
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

export default createTour
