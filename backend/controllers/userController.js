const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update user
const updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    country,
    city,
    birthDate,
    gender,
    languagesSpoken,
    interests,
    bio,
    currentPassword,
    newPassword,
  } = req.body;

  try {
    const user = await User.findById(req.user._id);

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;
    user.country = country || user.country;
    user.city = city || user.city;
    user.birthDate = birthDate || user.birthDate;
    user.gender = gender || user.gender;
    user.languagesSpoken = languagesSpoken || user.languagesSpoken;
    user.interests = interests || user.interests;
    user.bio = bio || user.bio;

    // Optional: Change password
    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) throw Error("Current password is incorrect");
      if (!validator.isStrongPassword(newPassword)) {
        throw Error("New password is not strong enough");
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, updateProfile };
