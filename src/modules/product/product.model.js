const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    company: {
      type: String,
      trim: true,
      maxLength: [50, "Your company name cannot exceed 50 characters"],
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      required: [true, "Please enter product description"],
      maxLength: [500, "Product description cannot exceed 500 characters"],
    },
    variants: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [10, "Product price cannot exceed 10 characters"],
      default: 0.0,
    },
    discount: {
      type: Number,
      maxLength: [10, "Product discount cannot exceed 10 characters"],
      default: 0.0,
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [5, "Product stock cannot exceed 5 characters"],
      default: 0,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sold: [
      {
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
