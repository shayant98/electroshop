const express = require("express");
const router = express.Router();
const {
  authUser,
  getUserProfile,
  registerUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/profile").get(protect, getUserProfile);

module.exports = router;
