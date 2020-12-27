const express = require("express");
const router = express.Router();
const {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.route("/login").post(authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUserById)
  .delete(protect, isAdmin, deleteUser);

module.exports = router;
