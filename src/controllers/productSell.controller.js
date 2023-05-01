import { productSellSchema } from './product.dto.js';
import { customerModel } from '../models/user.model.js';
import { productModel, productSoldModel  } from '../models/product.model.js';

export const productSellController = async (req, res) => {
  try {
    const isValidData = await productSellSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const { paidPrice, products, customerId } = isValidData.data;

    let totalPrice = 0;

    // check if customer exists
    const existingCustomer = await customerModel.findById(customerId);
    if (!existingCustomer) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    for (const product of products) {
      const { productId, quantity } = product;
      // check if product exists
      const existingProduct = await productModel.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ message: 'One or More product not found' });
      }

      const availableStock = existingProduct?.stock || 0;

      // check if quantity is less or equal to stock
      if (availableStock < quantity) {
        return res.status(400).json({
          message: `${existingProduct.name} is not available in the required quantity`,
        });
      }

      totalPrice = totalPrice + existingProduct.price * quantity;
    }

    await productSoldModel.create({
      products: products.map((product) => {
        return {
          productId: product.productId,
          quantity: product.quantity,
        };
      }),
      customerId,
      totalPrice,
      paidPrice,
      duePrice: totalPrice - paidPrice,
    });

    for (const product of products) {
      const { productId, quantity } = product;

      const existingProduct = await productModel.findById(productId);
      await productModel.findByIdAndUpdate(productId, {
        stock: existingProduct.stock - quantity,
      });
    }

    return res.status(200).json({
      message: 'Product sell successful',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'something went wrong',
    });
  }
};

export const getSellsListController = async (req, res) => {
  try {
    const sells = await productSoldModel.find();

    return res.status(200).json({
      message: 'Product sell list successful',
      data: {
        sells,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'something went wrong',
    });
  }
};

export const updateSellController = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { amount } = req.body;

    if (!recordId || !amount) {
      return res.status(400).json({
        message: 'invalid data',
      });
    }

    const existingRecord = await productSoldModel.findById(recordId);
    if (!existingRecord) {
      return res.status(404).json({
        message: ' sell record not found',
      });
    }

    await productSoldModel.findByIdAndUpdate(recordId, {
      paidPrice: existingRecord.paidPrice + amount,
      duePrice: existingRecord.duePrice - amount,
    });

    return res.status(200).json({
      message: 'sell record updated successful',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'something went wrong',
    });
  }
};