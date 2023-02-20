const userModel = require('../models/user.model');

const searchCustomer = async (req, res) => {
  try {
    const { name = '', email = '' } = req.query;

    console.log(name, email);

    const customers = await userModel.find({
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(email && { email: { $regex: email, $options: 'i' } }),
      role: 'customer',
    });

    return res.json({
      success: true,
      message: 'Customer list found',
      data: {
        customers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchCustomer,
};
