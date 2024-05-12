import mongoose, { Schema as MongooseSchema } from 'mongoose'
import { Country, City } from 'country-state-city'

const { Schema } = mongoose

export default interface ITour extends Document {
  name: string
  country: string
  city: string
  maxPeople: number
  typeOfAvailability: 'recurring' | 'one-time'
  availability?: string
  date?: Date
  from: Date
  to: Date
  description: string
  photos: string[]
  author: mongoose.Schema.Types.ObjectId
  reviewCount: number
}

const tourSchema: MongooseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) =>
          Country.getAllCountries().some((country) => country.name === value),
        message: (props: { value: string }) =>
          `${props.value} is not a valid country!`,
      },
    },
    city: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          const country = Country.getAllCountries().find(
            (country) => country.name === this.get('country'),
          )
          if (country) {
            return City.getCitiesOfCountry(country.isoCode).some(
              (city) => city.name === value,
            )
          }
          return false
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid city!`,
      },
    },
    maxPeople: {
      type: String,
      required: true,
    },
    typeOfAvailability: {
      type: String,
      required: true,
      enum: ['recurring', 'one-time'],
    },
    availability: {
      type: String,
      required: function () {
        return this.typeOfAvailability === 'recurring'
      },
      validate: {
        validator: function (value: string) {
          if (this.typeOfAvailability === 'recurring') {
            const validAvailabilities = ['weekdays', 'weekends', 'daily']
            return validAvailabilities.includes(value)
          }
          return true
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid recurring availability option.`,
      },
    },
    date: {
      type: String,
      required: function () {
        return this.typeOfAvailability === 'one-time'
      },
      validate: {
        validator: function (value: string) {
          if (this.typeOfAvailability === 'one-time') {
            const inputDate = new Date(value)
            inputDate.setHours(0, 0, 0, 0)

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            return inputDate >= tomorrow
          }
          return true
        },
        message: 'The date must be from tomorrow onwards.',
      },
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      minLength: 10,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
      validate: {
        validator: function (value: string[]) {
          return value.length > 0
        },
        message: 'At least one photo is required.',
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reviewCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Tour = mongoose.model<ITour>('Tour', tourSchema)
export { ITour, Tour }
