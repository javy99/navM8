import mongoose, { Schema as MongooseSchema } from 'mongoose'

export default interface IReview {
  tour: mongoose.Schema.Types.ObjectId
  user: mongoose.Schema.Types.ObjectId
  rating: number
  comment: string
}

const { Schema } = mongoose

const reviewSchema: MongooseSchema = new Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Review = mongoose.model<IReview>('Review', reviewSchema)
export { Review, IReview }
