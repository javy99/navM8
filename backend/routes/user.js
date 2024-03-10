const express = require("express");
const requireAuth = require("../middleware/requireAuth");

// controller functions
const {
  signupUser,
  loginUser,
  updateProfile,
} = require("../controllers/userController");

const router = express.Router();

// signup route
router.post("/signup", signupUser);

// login route
router.post("/login", loginUser);

// update profile route
router.patch("/profile", requireAuth, updateProfile);

module.exports = router;
