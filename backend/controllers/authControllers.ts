import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { User } from '../models'

interface CookieSettings {
  httpOnly: boolean
  secure: boolean
  sameSite: 'none' | 'lax' | 'strict'
  domain?: string
  maxAge: number
}

const generateCookieSettings = (maxAge: number): CookieSettings => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge,
})

const generateCookieSettingsForToken = generateCookieSettings(
  3 * 24 * 60 * 60 * 1000,
)
const generateCookieSettingsForRefreshToken = generateCookieSettings(
  7 * 24 * 60 * 60 * 1000,
)

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
    const refreshToken = createToken(user._id.toString(), '7d')

    res.cookie('token', token, generateCookieSettingsForToken)
    res.cookie(
      'refreshToken',
      refreshToken,
      generateCookieSettingsForRefreshToken,
    )

    res.status(200).json({ email, token, refreshToken, _id: user._id })
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
    const refreshToken = createToken(user._id.toString(), '7d')

    res.cookie('token', token, generateCookieSettingsForToken)
    res.cookie(
      'refreshToken',
      refreshToken,
      generateCookieSettingsForRefreshToken,
    )

    res.status(200).json({ email, token, refreshToken, _id: user._id })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const cookieSettings = generateCookieSettingsForToken
  const refreshCookieSettings = generateCookieSettingsForRefreshToken

  res.clearCookie('token', {
    httpOnly: cookieSettings.httpOnly,
    secure: cookieSettings.secure,
    sameSite: cookieSettings.sameSite,
  })
  res.clearCookie('refreshToken', {
    httpOnly: refreshCookieSettings.httpOnly,
    secure: refreshCookieSettings.secure,
    sameSite: refreshCookieSettings.sameSite,
  })

  res.status(200).json({ message: 'Logged out successfully' })
}

// refresh token
const refreshTokenHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { refreshToken: refreshTokenFromCookie } = req.cookies

  try {
    if (!refreshTokenFromCookie) {
      throw new Error('Refresh token is missing')
    }

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshTokenFromCookie,
      process.env.JWT_SECRET,
    ) as {
      _id: string
    }

    // Issue a new access token
    const token = createToken(decoded._id.toString(), '3d')

    // Send the new access token in the response
    res.cookie('token', token, generateCookieSettingsForToken)

    res.status(200).json({ token })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

const getUser = async (req: Request, res: Response): Promise<void> => {
  const { token, refreshToken } = req.cookies

  try {
    if (!req.user) {
      throw new Error('User not found')
    }

    res.json({
      _id: req.user._id,
      email: req.user.email,
      token,
      refreshToken,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unexpected error occurred' })
    }
  }
}

export {
  createToken,
  loginUser,
  signupUser,
  logoutUser,
  refreshTokenHandler,
  getUser,
}
