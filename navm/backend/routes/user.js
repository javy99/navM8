const express = require("express");

// controller functions
const { signupUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// signup route
router.post("/signup", signupUser);

// login route
router.post("/login", loginUser);

module.exports = router;
