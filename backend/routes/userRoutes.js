const express = require("express");
const router = express.Router();
const {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.route("/login").post(authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/:id").delete(protect, isAdmin, deleteUser);

module.exports = router;
