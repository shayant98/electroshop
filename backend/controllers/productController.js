const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.json(products);
});

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private.Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
module.exports = {
  getProductById,
  getProducts,
  deleteProduct,
};
