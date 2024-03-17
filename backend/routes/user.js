const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

// controller functions
const {
  signupUser,
  loginUser,
  updateProfile,
} = require("../controllers/userController");

const router = express.Router();

// homepage route

// signup route
router.post("/signup", signupUser);

// login route
router.post("/login", loginUser);

// update profile route
router.patch("/profile", requireAuth, updateProfile);

// implement get user profile route
router.get("/profile", requireAuth, (req, res) => {
  res.json(req.user);
});


module.exports = router;
