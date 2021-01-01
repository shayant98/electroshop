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
    couponCode: {
      type: String,
      required: true,
    },
    affectedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
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

saleModel.post("update", function (doc) {
  console.log("Update finished.");
});

const Sale = mongoose.model("Sale", saleModel);

module.exports = Sale;
