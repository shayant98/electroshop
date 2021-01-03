const asyncHandler = require("express-async-handler");
const Sale = require("../models/saleModel");
const mongoose = require("mongoose");

// @desc Create new sale
// @route POST /api/sales
// @access Private/Admin
const addSale = asyncHandler(async (req, res, next) => {
  const sale = new Sale({
    name: "Sample Sale",
    startsOn: "01/01/1990",
    endsOn: "01/01/1990",
    couponCode: "SMPLECDE",
    user: req.user._id,
  });

  const createdSale = await sale.save();
  res.status(201).json(createdSale);
});

// @desc get all sales
// @route GET /api/sales
// @access Priveate/Admin
const getSales = asyncHandler(async (req, res, next) => {
  const sales = await Sale.find();
  if (sales.length !== 0) {
    res.json(sales);
  } else {
    throw new Error("No Sales Found");
  }
});

// @desc get active sales
// @route GET /api/sales/active
// @access Public
const getActiveSales = asyncHandler(async (req, res, next) => {
  const sales = await Sale.find({ isActive: true });
  res.json(sales);
});

// @desc update Sale
// @route PUT /api/sales/:id
// @access Private/Admin
const updateSale = asyncHandler(async (req, res, next) => {
  const {
    name,
    startsOn,
    endsOn,
    percentage,
    ammount,
    isActive,
    coupon,
  } = req.body;
  const sale = await Sale.findById(req.params.id);
  if (sale) {
    sale.name = name;
    sale.startsOn = startsOn;
    sale.endsOn = endsOn;
    sale.isActive = isActive;
    sale.salePercentage = percentage ?? 0;
    sale.saleAmmount = ammount ?? 0;
    sale.couponCode = coupon;

    const updatedSale = await sale.save();
    res.json(updatedSale);
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

// @desc get sale by id
// @route GET /api/sales/:id
// @access Private/Admin
const getSaleById = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

// @desc Delete sale
// @route DELETE /api/sales/:id
// @access Private/Admin
const deleteSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (sale) {
    await sale.remove();
    res.json({ message: "Sale removed" });
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

// @desc get sale by coupon
// @route GET /api/sales/:coupon/coupon
// @access Private/Admin
const getSaleByCoupon = asyncHandler(async (req, res, next) => {
  const currentDate = Date.now();

  const sale = await Sale.findOne({
    couponCode: req.params.coupon,
    isActive: true,
    endsOn: { $gte: currentDate },
    startsOn: { $lte: currentDate },
  });

  if (sale) {
    res.json(sale);
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

module.exports = {
  addSale,
  getSales,
  getActiveSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSaleByCoupon,
};
