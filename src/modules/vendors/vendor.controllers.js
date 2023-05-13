import { vendorModel } from '../platform-users/user.model.js';
import { addNewVendorSchema, updateVendorSchema } from './vendor.dto.js';

export const addNewVendorController = async (req, res) => {
  try {
    const isValidData = await addNewVendorSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const { agentName, companyName, email, phone } = isValidData.data;

    // check if vendor exists with phone number
    const existingVendor = await vendorModel.findOne({ phone });

    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    await vendorModel.create({
      agentName,
      companyName,
      email,
      phone,
    });

    return res.status(201).json({ message: 'Vendor created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export const updateVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const isValidData = await updateVendorSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    //   check if vendor exists
    const vendor = await vendorModel.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const { firstName, lastName, companyName, email, phone } = isValidData.data;

    await vendorModel.findByIdAndUpdate(vendorId, {
      firstName,
      lastName,
      companyName,
      email,
      phone,
    });

    return res.status(200).json({ message: 'Vendor updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getVendorsController = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 30,
      sort: { createdAt: -1 },
    };

    const result = await vendorModel.aggregate([
      {
        $facet: {
          vendors: [
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit,
            },
            {
              $sort: options.sort,
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                companyName: 1,
                email: 1,
                phone: 1,
              },
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

    const vendors = result[0].vendors;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: 'vendor fetched successfully',
      data: {
        vendors: vendors,
        totalCount: totalCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
