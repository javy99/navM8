import mongoose, { Document } from "mongoose";

export default interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  birthDate?: Date;
  gender?: string;
  languagesSpoken?: string[];
  interests?: string[];
  bio?: string;
  favoriteTours?: mongoose.Schema.Types.ObjectId[];
  createdAt?: Date;
}
