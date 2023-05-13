import { productModel, stockInModel } from './product.model.js';
import { vendorModel } from '../platform-users/user.model.js';
import { productStockInSchema } from './product.dto.js';

export const addNewStockInController = async (req, res) => {
  try {
    const isValidData = await productStockInSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const { vendorId, productId } = isValidData.data;

    //  check if product exists
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    //   check if vendor exists
    const existingVendor = await vendorModel.findById(vendorId);
    if (!existingVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const { paidPrice, totalPrice, quantity } = isValidData.data;

    // check if paid price is greater than total price
    if (paidPrice > totalPrice) {
      return res.status(400).json({
        message: 'Paid price cannot be greater than total price',
      });
    }

    // create stock in
    await stockInModel.create({
      vendor: vendorId,
      product: productId,
      paidPrice,
      totalPrice,
      quantity,
      duePrice: totalPrice - paidPrice,
    });

    // update product stock
    await productModel.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: quantity },
      },
      { new: true }
    );

    return res.status(201).json({
      message: 'Product stored successfully',
      stock: existingProduct.stock + quantity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
