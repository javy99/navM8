import mongoose, { type Schema as MongooseSchema } from 'mongoose'

const Schema = mongoose.Schema

const tourSchema: MongooseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  maxPeople: {
    type: Number,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    required: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // here do we use User email or token or we can access everything from the User model? answer: You can access everything from the User model. You can use the populate method to populate the author field with the user data. This will allow you to access the user's data when you query the tour model. For example, you can access the user's email, username, and other fields from the user model using the author field in the tour model.
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // we also have upload photos fields so that the author can upload photos of the tour, but the question is: how to store photos since the author can upload multiple photos and it will be very huge in size if we store it in the database. Where to store it? I am now for example storing profile photo in localStorage. So the question is: What do you suggest here? Where to store it? And how to store it?
  // answer: You can store the photos in a cloud storage service like AWS S3 or Google Cloud Storage. You can also use a service like Cloudinary which is specifically designed for storing and serving images. You can store the URL of the image in the database and then use that URL to display the image in your app.
})

module.exports = mongoose.model('Tour', tourSchema)
