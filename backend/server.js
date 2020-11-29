const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

dotenv.config();
connectDB();

const PORT = 5000 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    `running in ${process.env.NODE_ENV} mode on PORT: ${process.env.PORT}`
  )
);
