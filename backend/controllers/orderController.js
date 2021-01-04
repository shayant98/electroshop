const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const { sendEmail } = require("../utils/mail");

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order Items");
  } else {
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc Get order by id
// @route Get /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  console.log(req.user._id, order.user._id);
  if (order && (req.user._id.equals(order.user._id) || req.user.isAdmin)) {
    res.json(order);
  } else {
    console.log();
    res.status(404);
    throw new Error(`${req.user._id}-${order.user._id}`);
  }
});

// @desc Update Order to PAID
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "email");

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const data = {
      templateName: "order",
      receiver: order.user.email,
      order: order._id,
      tax: order.taxPrice,
      itemsPrice: order.orderItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      ),
      shipping: order.shippingPrice,
      total: order.totalPrice,
      orderItems: order.orderItems,
    };
    await sendEmail(data);

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
// @desc Update Order to DELIVERED
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc get logged in user orders
// @route Get /api/orders/myorders
// @access Private
const getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc get all  orders
// @route Get /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});
module.exports = {
  addOrderItems,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrderById,
  getUserOrders,
  getOrders,
};
