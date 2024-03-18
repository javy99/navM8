import mongoose, { Document, Model, Schema as MongooseSchema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import IUser from "../types/IUser";

interface IUserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>;
  signup(username: string, email: string, password: string): Promise<IUser>;
}

const Schema = mongoose.Schema;

const userSchema: MongooseSchema = new Schema({
  // signup/login fields
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // profile fields
  firstName: String,
  lastName: String,
  phoneNumber: String,
  country: String,
  city: String,
  birthDate: Date,
  gender: String,
  languagesSpoken: {
    type: [String],
    default: undefined,
  },
  interests: {
    type: [String],
    default: undefined,
  },
  bio: String,
  // tour fields
  favoriteTours: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tour",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Signup static method
userSchema.statics.signup = async function (
  username: string,
  email: string,
  password: string
): Promise<IUser> {
  // Basic validation
  if (!email || !password || !username) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  if (username.length < 3) {
    throw Error("Username must be at least 3 characters long");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, username });
  return user;
};

// Login static method
userSchema.statics.login = async function (
  email: string,
  password: string
): Promise<IUser> {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

export const User: IUserModel = mongoose.model<IUser, IUserModel>(
  "User",
  userSchema
);
