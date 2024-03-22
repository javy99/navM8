import { Country, City } from 'country-state-city'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import validator from 'validator'
import { User } from '../models/userModel'
import * as dotenv from 'dotenv'

dotenv.config()

const createToken = (_id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
  }
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })
}

// login user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create token
    const token = createToken(user._id.toString())

    res.status(200).json({ email, token, id: user._id })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unknown error occurred' })
    }
  }
}

// signup user
const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body

  try {
    const user = await User.signup(username, email, password)

    // create token
    const token = createToken(user._id.toString())

    res.status(200).json({ email, token, id: user._id })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

// update user
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

    // Validate country and city
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

    // Update fields
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

    // Optional: Change password
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

export { signupUser, loginUser, updateProfile }
