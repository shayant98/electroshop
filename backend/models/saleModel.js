const mongoose = require("mongoose");

const saleModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startsOn: {
      type: Date,
      required: true,
    },
    endsOn: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    salePercentage: {
      type: Number,
      default: 0,
    },
    saleAmmount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", saleModel);

module.exports = Sale;
