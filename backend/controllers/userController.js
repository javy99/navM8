const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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

module.exports = { loginUser, signupUser };

// // signup controller
// const signupUser = async (req, res) => {
//   try {
//     const { username, email, password, userType } = req.body;
//     const user = await User.signup(username, email, password, userType); // Using the static signup method
//     res
//       .status(201)
//       .json({ message: "User created successfully", userId: user._id });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error creating user", error: error.message });
//   }
// };

// // Login controller
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.login(email, password); // Using the static login method
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "2h",
//     });
//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Login error", error: error.message });
//   }
// };

// module.exports = { signupUser, loginUser };
