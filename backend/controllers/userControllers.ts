import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import { Country, City } from 'country-state-city'
import { Request, Response } from 'express'
import { Readable } from 'stream'
import { User } from '../models'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = (buffer: Buffer): Promise<any> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'userProfilePhotos', secure: true, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      },
    )

    const readableStream = new Readable()
    readableStream.push(buffer)
    readableStream.push(null)
    readableStream.pipe(uploadStream)
  })

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    country,
    city,
    birthDate,
    gender,
    languagesSpoken,
    interests,
    bio,
    currentPassword,
    newPassword,
  } = req.body

  if (!req.user?._id) {
    res.status(400).json({ error: 'User ID missing from request.' })
    return
  }

  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404).json({ error: 'User not found.' })
      return
    }

    if (country && !Country.getAllCountries().some((c) => c.name === country)) {
      throw Error('Invalid country')
    }

    if (city) {
      const countryObj = Country.getAllCountries().find(
        (c) => c.name === country,
      )
      if (
        !countryObj ||
        !City.getCitiesOfCountry(countryObj.isoCode).some(
          (c) => c.name === city,
        )
      ) {
        throw Error('Invalid city')
      }
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.email = email || user.email
    user.country = country || user.country
    user.city = city || user.city
    user.birthDate = birthDate || user.birthDate
    user.gender = gender || user.gender
    user.languagesSpoken = languagesSpoken || user.languagesSpoken
    user.interests = interests || user.interests
    user.bio = bio || user.bio

    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(currentPassword, user.password)
      if (!match) throw Error('Current password is incorrect')
      if (!validator.isStrongPassword(newPassword)) {
        throw Error('New password is not strong enough')
      }
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    await user.save()

    res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.json(req.user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const uploadProfilePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' })
  }

  const fileType = req.file.mimetype
  const fileSize = req.file.size
  if (
    !['image/jpg', 'image/jpeg', 'image/png'].includes(fileType) ||
    fileSize > 1024 * 1024 * 5
  ) {
    return res.status(400).json({ error: 'Invalid file type or size.' })
  }

  if (!req.user?._id) {
    return res.status(400).json({ error: 'User authentication failed.' })
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer)

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePictureURL: result.secure_url },
      { new: true },
    )
    console.log('updatedUser:', updatedUser)

    res.json({
      message: 'Profile photo uploaded successfully',
      profilePictureURL: result.secure_url,
    })
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const getProfilePhoto = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    const profilePictureURL = user.profilePictureURL || null
    res.status(200).json({ profilePictureURL })
  } catch (error) {
    console.error('Error fetching profile photo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user || !user.profilePictureURL) {
      return res.status(404).json({ error: 'Profile photo not found.' })
    }

    const urlParts = user.profilePictureURL.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const publicId = `userProfilePhotos/${fileName.split('.')[0]}`

    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary.')
    }

    user.profilePictureURL = ''
    await user.save()

    res.status(200).json({ message: 'Profile photo deleted successfully.' })
  } catch (error) {
    console.error('Error deleting profile photo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Search users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query

    let queryObj = {}

    if (search) {
      queryObj = {
        $or: [
          { email: new RegExp(search.toString(), 'i') },
          { firstName: new RegExp(search.toString(), 'i') },
        ],
      }
    }

    const users = await User.find(queryObj)

    res.json(users)
  } catch (error) {
    console.error('Error fetching all users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const addFavoriteTour = async (req: Request, res: Response) => {
  const userId = req.params.id
  const { tourId } = req.body

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).send('User not found.')
    }

    if (user.favoriteTours.includes(tourId)) {
      return res.status(400).send('Tour is already in favorites.')
    }

    user.favoriteTours.push(tourId)
    await user.save()

    res.status(200).json({
      message: 'Tour added to favorites successfully.',
      favoriteTours: user.favoriteTours,
    })
  } catch (error) {
    console.error('Error adding tour to favorites:', error)
    res.status(500).send('Error adding tour to favorites.')
  }
}

const deleteFavoriteTour = async (req: Request, res: Response) => {
  const userId = req.params.id
  const { tourId } = req.params

  try {
    const updateResult = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { favoriteTours: tourId },
      },
      { new: true },
    )

    if (!updateResult) {
      return res
        .status(404)
        .send('User not found or tour was not in favorites.')
    }

    res.status(200).json({
      message: 'Tour removed from favorites successfully.',
      favoriteTours: updateResult.favoriteTours,
    })
  } catch (error) {
    console.error('Error removing tour from favorites:', error)
    res.status(500).send('Error removing tour from favorites.')
  }
}

const getFavoriteTours = async (req: Request, res: Response) => {
  const userId = req.params.id

  try {
    const user = await User.findById(userId)
      .populate('favoriteTours')
      .populate({
        path: 'favoriteTours',
        populate: { path: 'author' },
      })
      .exec()

    if (!user) {
      return res.status(404).send('User not found.')
    }

    res.json(user.favoriteTours)
  } catch (error) {
    console.error('Error fetching favorite tours:', error)
    res.status(500).send('Error fetching favorite tours.')
  }
}

export {
  updateProfile,
  getProfile,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteProfilePhoto,
  getAllUsers,
  addFavoriteTour,
  deleteFavoriteTour,
  getFavoriteTours,
}
