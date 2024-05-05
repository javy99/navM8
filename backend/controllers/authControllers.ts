import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { User } from '../models'

const createToken = (_id: string, expiresIn: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
  }
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn,
  })
}

// login user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create tokens
    const token = createToken(user._id.toString(), '3d')
    const refreshToken = createToken(user._id.toString(), '7d') // New token with longer expiration

    // Set cookies here
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

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

    // create tokens
    const token = createToken(user._id.toString(), '3d')
    const refreshToken = createToken(user._id.toString(), '7d') // New token with longer expiration

    // Set cookies here
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({ email, token, _id: user._id })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token')
  res.clearCookie('refreshToken')
  res.status(200).json({ message: 'Logged out successfully' })
}

// refresh token
const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken

  try {
    if (!refreshToken) {
      throw new Error('Refresh token is missing')
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET) as {
      _id: string
    }

    // Issue a new access token
    const token = createToken(decoded._id.toString(), '3d')

    // Send the new access token in the response
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({ token })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

export { createToken, loginUser, signupUser, logoutUser, refreshToken }
