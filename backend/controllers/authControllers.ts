import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { User } from '../models'

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

    res.status(200).json({ email, token, _id: user._id })
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

    res.status(200).json({ email, token, _id: user._id })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

export { loginUser, signupUser }
