const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
  addSale,
  getActiveSales,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSaleByCoupon,
} = require("../controllers/saleController");

router
  .route("/")
  .post(protect, isAdmin, addSale)
  .get(protect, isAdmin, getSales);

router.route("/active").get(getActiveSales);
router
  .route("/:id")
  .get(protect, isAdmin, getSaleById)
  .put(protect, isAdmin, updateSale)
  .delete(protect, isAdmin, deleteSale);

router.route("/:coupon/coupon").get(protect, isAdmin, getSaleByCoupon);
module.exports = router;
