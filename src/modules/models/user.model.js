const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "fullName is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "manager"],
    default: "customer",
    message: "Please select a correct role",
  },
  userType: {
    type: String,
    enum: ["individual", "business"],
    default: "individual",
    required: false,
  },
  Permissions: ["create", "read", "update", "delete"],
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Encrypt password using bcrypt
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, permissions: this.permissions },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.hashPassword = async function () {
  return await bcrypt.hash(this.password, 12);
};

module.exports = mongoose.model("User", userSchema);
