const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { generateToken, generateEmailToken } = require("../utils/generateToken");
const { sendEmail } = require("../utils/mail");

// @desc Authenticate user with email & return tokem
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const data = {
      templateName: "confirm_account",
      receiver: user.email,
      name: user.name,
      confirm_account_url: `${
        req.hostname
      }/api/users/verify/${generateEmailToken(user._id)}`,
    };
    await sendEmail(data);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  const search = req.query.search;
  if (search) {
    query = { $text: { $search: search } };
  } else {
    query = {};
  }
  const users = await User.find({ ...query });

  res.json(users);
});
// @desc Delete user
// @route GET /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get users by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user by id
// @route PUT /api/users/:id
// @access Private/Admin
const updateUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Verify user account
// @route PUT /api/users/verify/:token
// @access Private/Admin
const verifyUser = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    res.status(400);
    throw Error("Invalid Link");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    if (decoded === undefined) {
      throw Error("Invalid Token");
    }

    const user = await User.findById(decoded.id).select("-password");

    user.isVerified = true;

    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (error) {
    throw Error("User not found");
  }
});

module.exports = {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
  verifyUser,
};
