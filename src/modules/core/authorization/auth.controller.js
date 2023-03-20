const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieOptions = require('../../../utils/cookie');
const userSchema = require('../../models/user.model');
const { RegistrationSchema } = require('../../core/authorization/auth.dto');

const register = async (req, res) => {
  try {
    const { role, id } = req.userData;
    console.log(role, id);
    const isValidData = await RegistrationSchema.safeParseAsync(req.body);

    console.log(isValidData.data);

    if (!isValidData.success) {
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });
    }

    const {
      userName,
      fullName,
      email,
      password,
      confirmPassword,
      permissions,
    } = isValidData.data;

    console.log(password, confirmPassword);

    const invalidPermissions = permissions.filter(
      (permission) =>
        !['create', 'read', 'update', 'delete'].includes(permission)
    );
    if (invalidPermissions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid permissions',
      });
    }

    const uniquePermissions = [...new Set(permissions)];

    console.log(uniquePermissions);

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords does not match',
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);

    const newUser = await userSchema.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
      role:
        role === 'manager'
          ? 'admin'
          : role === 'admin'
          ? 'customer'
          : 'customer',
      permissions: uniquePermissions.length ? uniquePermissions : [],
      addedBy: id,
    });

    console.log(newUser);

    const { password: __, ...userData } = user.toObject();

    console.log(user.toObject());

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: userData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await userSchema.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, permissions: [] },
      process.env.JWT_SECRET
    );

    const { password: __, ...userData } = user.toObject();

    return res.cookie('token', token, cookieOptions()).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const isLoggedIn = async (req, res) => {
  try {
    const cookie = req.cookies.token;

    if (!cookie) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);

    const user = await userSchema.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.json({
      success: true,
      message: 'Authorized',
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updatePermissions = async (req, res) => {
  try {
    const { id } = req.userData;
    const { userId } = req.params;

    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: 'Permissions must be an array',
      });
    }

    const invalidPermissions = permissions.filter(
      (permission) =>
        !['create', 'read', 'update', 'delete'].includes(permission)
    );

    if (invalidPermissions.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid permissions: ${invalidPermissions.join(', ')}`,
      });
    }

    const uniquePermissions = [...new Set(permissions)];

    const user = await userSchema.findOne({ _id: userId, addedBy: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateUserPermissions = await userSchema.findByIdAndUpdate(
      userId,
      { permissions: uniquePermissions.length ? uniquePermissions : [] },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Permissions updated successfully',
      data: {
        user: updateUserPermissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token').json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  register,
  login,
  isLoggedIn,
  updatePermissions,
  logout,
};
