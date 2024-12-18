import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { Server as SocketIOServer } from 'socket.io'

import {
  authRouter,
  userRouter,
  toursRouter,
  chatRouter,
  messageRouter,
  bookingRouter,
  reviewRouter,
} from './routes'
import { notFound, errorHandler } from './middlewares'

interface CustomError extends Error {
  status?: number
}

dotenv.config()
const { MONGODB_URL, PORT } = process.env

// express app
const app = express()

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['Authorization'],
}

// middleware
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))

// Initialize HTTP server from Express app
const server = http.createServer(app)

// Initialize socket.io and bind it to the HTTP server
const io = new SocketIOServer(server, {
  pingTimeout: 60000,
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})

// socket.io connection event
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id)

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')

    socket.on('disconnect', () => {
      console.log('USER DISCONNECTED')
      socket.leave(userData._id)
    })
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log('User Joined Room:', room)
  })

  socket.on('typing', ({ chatId }) =>
    socket.to(chatId).emit('typing', { chatId }),
  )
  socket.on('stop typing', ({ chatId }) =>
    socket.to(chatId).emit('stop typing', { chatId }),
  )

  socket.on('new message', (newMessageReceived) => {
    const { chat } = newMessageReceived

    if (!chat.users) return console.log('Chat.users not defined')

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return

      socket.in(user._id).emit('message received', newMessageReceived)
    })
  })
})

// routes
app.use('/api/bookings', bookingRouter)
app.use('/api/messages', messageRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/tours', toursRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/chats', chatRouter)
app.use(notFound)
app.use(errorHandler)

// Error handling middleware
app.use(
  (error: CustomError, req: Request, res: Response, _next: NextFunction) => {
    res
      .status(error.status || 500)
      .json({ message: error.message || 'An unexpected error occurred' })
  },
)

// connect to MongoDB
if (MONGODB_URL) {
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      server.listen(PORT, () => {
        console.log(
          '==============================================================',
        )
        console.log(
          `===== Connected to MongoDB and listening on port ${PORT} :) =====`,
        )
        console.log(
          '==============================================================',
        )
      })
    })
    .catch((err: unknown) => {
      if (err instanceof Error) {
        console.error('Error connecting to MongoDB:', err.message)
      } else {
        console.error('Error connecting to MongoDB with an unexpected type')
      }
    })
} else {
  console.error('MONGODB_URL is not defined')
}
