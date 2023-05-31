import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
  }
});

const vendorSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
  },
});

const userModel = mongoose.model('User', userSchema);
const customerModel = mongoose.model('Customer', customerSchema);
const vendorModel = mongoose.model('Vendor', vendorSchema);

export { userModel, customerModel, vendorModel };
