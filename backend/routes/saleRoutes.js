const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
  addSale,
  getActiveSales,
  getSales,
  getSaleById,
  updateSale,
} = require("../controllers/saleController");

router
  .route("/")
  .post(protect, isAdmin, addSale)
  .get(protect, isAdmin, getSales);

router.route("/active").get(getActiveSales);
router
  .route("/:id")
  .get(protect, isAdmin, getSaleById)
  .put(protect, isAdmin, updateSale);

module.exports = router;
