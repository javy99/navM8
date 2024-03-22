import { Country, City } from 'country-state-city'
import mongoose, { Schema as MongooseSchema } from 'mongoose'

const { Schema } = mongoose

const tourSchema: MongooseSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Tour = mongoose.model('Tour', tourSchema)
export default Tour
