import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
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
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model('Product', productSchema);

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
    totalPrice: {
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

export const stockInModel = mongoose.model('StockIn', vendorStockInSchema);

const productSoldSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paidPrice: {
      type: Number,
      required: true,
    },
    duePrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const productSoldModel = mongoose.model('ProductSold', productSoldSchema);
