const asyncHandler = require("express-async-handler");
const Sale = require("../models/saleModel");

// @desc Create new sale
// @route POST /api/sales
// @access Private/Admin
const addSale = asyncHandler(async (req, res, next) => {
  const sale = new Sale({
    name: "Sample Sale",
    startsOn: "01/01/1990",
    endsOn: "01/01/1990",
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

// @desc get sale by id
// @route GET /api/sales/:id
// @access Private/Admin
const getSaleById = asyncHandler(async (req, res, next) => {
  const {
    name,
    startsOn,
    endsOn,
    percentge,
    ammount,
    isActive,
    products,
  } = req.body;
  const sale = await Sale.findById(req.params.id);
  if (sale) {
    sale.name = name;
    sale.startsOn = startsOn;
    sale.endsOn = endsOn;
    sale.isActive = isActive;
    sale.percentge = percentge;
    sale.ammount = ammount;
    sale.affectedProducts = products.length;
  } else {
    res.status(404);
    throw new Error("Sale not found");
  }
});

// @desc get sale by id
// @route GET /api/sales/:id
// @access Private/Admin
const updateSale = asyncHandler(async (req, res, next) => {
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

module.exports = {
  addSale,
  getSales,
  getActiveSales,
  getSaleById,
  updateSale,
  deleteSale,
};
