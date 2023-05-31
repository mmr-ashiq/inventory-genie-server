import { customerModel } from '../platform-users/user.model.js';
import { addNewCustomerSchema, updateCustomerSchema } from './customer.dto.js';

export const addNewCustomerController = async (req, res) => {
  try {
    const isValidData = await addNewCustomerSchema.safeParseAsync(req.body);
    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const { name, email, phone, address } = isValidData.data;

    const existingCustomer = await customerModel.findOne({ phone });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    await customerModel.create({
      name,
      email,
      phone,
      address,
    });

    return res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateCustomerController = async (req, res) => {
  try {
    const { customerId } = req.params;

    const isValidData = await updateCustomerSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const customer = await customerModel.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { name, email, phone, address } = isValidData.data;

    await customerModel.findByIdAndUpdate(customerId, {
      name,
      email,
      phone,
      address,
    });

    return res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getCustomersController = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 30,
      sort: { createdAt: -1 },
    };

    const result = await customerModel.aggregate([
      {
        $facet: {
          customers: [
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit,
            },
            {
              $sort: options.sort,
            },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const customers = result[0].customers;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: 'customer fetched successfully',
      data: {
        customers: customers,
        totalCount: totalCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSingleCustomerController = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await customerModel.findOne({ _id: customerId });

    if (!customer) {
      return res.status(404).json({ message: 'customer not found' });
    }

    return res.status(200).json({
      message: 'customer fetched successfully',
      data: {
        customer,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteCustomerController = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await customerModel.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customerModel.deleteOne({ _id: customerId });

    res.status(200).json({ 
        message: 'Customer deleted successfully',
        data: {
            customer: customer
        }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
