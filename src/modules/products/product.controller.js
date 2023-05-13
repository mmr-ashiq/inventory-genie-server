import { v2 as cloudinary } from 'cloudinary';

import { config } from '../../config/lib/config.js';
import { productModel } from './product.model.js';
import { addNewProductSchema, updateProductSchema } from './product.dto.js';

export const addNewProductController = async (req, res) => {
  try {
    const isValidData = await addNewProductSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const { name, price, category, company, description, discount, variants } =
      isValidData.data;

    let product = await productModel.create({
      name,
      price,
      category: category ? JSON.parse(category) : [],
      company,
      description,
      discount,
      variants: variants ? JSON.parse(variants) : [],
    });

    if (Array.isArray(images) && images.length) {
      for (const image of images) {
        const response = await cloudinary.uploader.upload(image.path, {
          folder: 'products',
          use_filename: true,
          unique_filename: false,
        });

        console.log(response);

        // update product with image url
        product = await productModel.findByIdAndUpdate(
          { _id: product._id },
          {
            $push: { images: response.secure_url },
          },
          { new: true }
        );
      }
    }

    if (!Array.isArray(images) && images?.name) {
      const { path } = images;
      const response = await cloudinary.uploader.upload(path, {
        folder: 'products',
        use_filename: true,
        unique_filename: false,
      });

      // update product with image url
      product = await productModel.findByIdAndUpdate(
        { _id: product._id },
        {
          $push: { images: response.secure_url },
        },
        { new: true }
      );
    }

    return res.status(201).json({ message: 'Product add successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const isValidData = await updateProductSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    //   check if product exists
    const existingProduct = await productModel.findOne({ _id: productId });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, category, company, description, discount, variants } = isValidData.data;

    await productModel.findByIdAndUpdate(productId, {
      name,
      price,
      category,
      company,
      description,
      discount,
      variants,
    });

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 30,
      sort: { createdAt: 1 },
    };

    const result = await productModel.aggregate([
      {
        $facet: {
          products: [
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

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;

    return res.status(200).json({
      message: 'Products fetched successfully',
      data: {
        products,
        totalCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
