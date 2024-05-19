import jwt, { Secret } from 'jsonwebtoken'

import { Request, Response, NextFunction } from 'express'
import { User } from '../models'
import { createToken } from '../controllers/authControllers'

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies
  const { refreshToken } = req.cookies

  if (!token && !refreshToken) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET as Secret

    if (!JWT_SECRET) {
      throw new Error('JWT secret is not defined.')
    }

    // Verify the access token
    let decoded: { _id: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { _id: string }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError && refreshToken) {
        const refreshDecoded = jwt.verify(refreshToken, JWT_SECRET) as {
          _id: string
        }
        const newToken = createToken(refreshDecoded._id.toString(), '3d')

        // Set the new access token in the response cookies
        res.cookie('token', newToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3 * 24 * 60 * 60 * 1000,
        })

        // Decode the new access token
        decoded = jwt.verify(newToken, JWT_SECRET) as { _id: string }
      } else {
        throw error
      }
    }

    // Find the user based on the decoded token
    const user = await User.findById(decoded._id).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Request is not authorized' })
  }
}

export default requireAuth
