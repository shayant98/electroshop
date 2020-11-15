const express = require("express");
const products = require("./data/products");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();

dotenv.config();
connectDB();

const PORT = 5000 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((product) => product._id === req.params.id);
  res.json(product);
});

app.listen(
  PORT,
  console.log(
    `running in ${process.env.NODE_ENV} mode on PORT: ${process.env.PORT}`
  )
);
