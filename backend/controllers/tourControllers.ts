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

const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('author').exec()
  
    if (!tour) {
      res.status(404).json({ error: 'Tour not found' })
      return
    }

    res.json(tour)
  } catch (error) {
    console.error('Error fetching tour:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const updateTour = async (req: Request, res: Response) => {
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

    const tourId = req.params.id

    const tour = await Tour.findById(tourId)

    if (!tour) {
      res.status(404).json({ error: 'Tour not found' })
      return
    }

    // Check if the user is authorized to edit the tour
    if (tour.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    // Update tour fields
    tour.name = name
    tour.country = country
    tour.city = city
    tour.maxPeople = maxPeople
    tour.typeOfAvailability = typeOfAvailability
    tour.availability = availability
    tour.date = date
    tour.from = from
    tour.to = to
    tour.description = description

    await tour.save()

    res.json(tour)
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const deleteTour = async (req: Request, res: Response) => {
  try {
    const tourId = req.params.id

    const tour = await Tour.findById(tourId)

    if (!tour) {
      res.status(404).json({ error: 'Tour not found' })
      return
    }

    // Check if the user is authorized to delete the tour
    if (tour.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Unauthorized' })
      return
    }

    await Tour.deleteOne({ _id: tourId })

    res.json({ message: 'Tour deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export { getAllTours, createTour, getMyTours, getTour, updateTour, deleteTour }
