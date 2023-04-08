import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: Array,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  variants: {
    type: Array,
    required: false,
  },
  discount: {
    type: Number,
    required: false,
  },
  stock: {
    type: Number,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
});

export const Product = mongoose.model('Product', productSchema);

const vendorStockInSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    paidPrice: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const VendorStockIn = mongoose.model('VendorStockIn', vendorStockInSchema);

const productSoldSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductSold = mongoose.model('ProductSold', productSoldSchema);
