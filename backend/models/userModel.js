const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Signup static method
userSchema.statics.signup = async function (username, email, password) {
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
userSchema.statics.login = async function (email, password) {
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

module.exports = mongoose.model("User", userSchema);
