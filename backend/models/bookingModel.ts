import mongoose, { Schema as MongooseSchema } from 'mongoose'
import ITour from './tourModel'

export default interface IBooking extends Document {
  tour: ITour
  userId: mongoose.Schema.Types.ObjectId
  date: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
}

const { Schema } = mongoose

const bookingSchema: MongooseSchema = new Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  },
)

const Booking = mongoose.model<IBooking>('Booking', bookingSchema)
export { IBooking, Booking }
