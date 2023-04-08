import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from '../app/config.js';
import { RegistrationSchema } from '../controllers/auth.dto.js';
import { userModel } from '../models/user.model.js';
import { cookieOptions } from '../utils/cookie.js';

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email }).select('+password');

    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(password, user.password);

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        permissions: user.permissions,
        email: user.email,
      },
      config.jwtSecret
    );

    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    return res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({ user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const registrationController = async (req, res) => {
  try {
    const isValidData = await RegistrationSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const { email, password, permissions, confirmPassword, name, role } = isValidData.data;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 12);

    const user = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      permissions: permissions?.length ? permissions : [],
    });

    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    return res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};