const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const generateEmailToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_EMAIL_SECRET, { expiresIn: "1d" });
};

module.exports = { generateToken, generateEmailToken };
