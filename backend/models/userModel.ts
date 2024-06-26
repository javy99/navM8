import mongoose, { Model, Schema as MongooseSchema } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { Country, City } from 'country-state-city'

export default interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId
  username: string
  email: string
  password: string
  profilePictureURL?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  country?: string
  city?: string
  birthDate?: Date
  gender?: string
  languagesSpoken?: string[]
  interests?: string[]
  bio?: string
  favoriteTours?: mongoose.Schema.Types.ObjectId[]
  createdAt?: Date
}

export interface IUserModel extends Model<IUser> {
  signup: (username: string, email: string, password: string) => Promise<IUser>
  login: (email: string, password: string) => Promise<IUser>
}

const { Schema } = mongoose

const userSchema: MongooseSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (str: string) => validator.isEmail(str),
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message: (props) => `${props.value} is not a strong enough password!`,
      },
    },
    profilePictureURL: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: (value) => validator.isMobilePhone(value, 'any'),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    country: {
      type: String,
      validate: {
        validator: (value: string) =>
          Country.getAllCountries().some((country) => country.name === value),
        message: (props: { value: string }) =>
          `${props.value} is not a valid country!`,
      },
    },
    city: {
      type: String,
      validate: {
        validator(value: string) {
          const countryObj = Country.getAllCountries().find(
            (country) => country.name === this.get('country'),
          )
          if (countryObj) {
            return City.getCitiesOfCountry(countryObj.isoCode).some(
              (city) => city.name === value,
            )
          }
          return false
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid city!`,
      },
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    languagesSpoken: {
      type: [String],
      default: undefined,
    },
    interests: {
      type: [String],
      default: undefined,
    },
    bio: {
      type: String,
      minLength: 10,
    },
    favoriteTours: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Tour',
    },
  },
  {
    timestamps: true,
  },
)

// Signup static method
userSchema.statics.signup = async function (
  username: string,
  email: string,
  password: string,
): Promise<IUser> {
  if (!email || !password || !username) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough')
  }
  if (username.length < 3) {
    throw Error('Username must be at least 3 characters long')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email is already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash, username })
  return user
}

// Login static method
userSchema.statics.login = async function (
  email: string,
  password: string,
): Promise<IUser> {
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })

  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema)
export { User, IUser }
