const express = require("express");
const router = express.Router();
const {
  getProductById,
  getProducts,
  deleteProduct,
} = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, isAdmin, deleteProduct);

module.exports = router;
