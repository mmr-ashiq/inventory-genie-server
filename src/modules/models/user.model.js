const mongoose = require('mongoose');
const bycrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'userName is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, 'fullName is required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    select: false,
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer',
    message: 'Please select a correct role',
  },
  userType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual',
    required: false,
  },
  permissions: ['create', 'read', 'update', 'delete'],
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
