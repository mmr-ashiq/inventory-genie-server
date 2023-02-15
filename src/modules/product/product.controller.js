const { addProductSchema } = require("./product.dto");
const productSchema = require("../models/product.model");
const userSchema = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

const addProduct = async (req, res) => {
  try {
    const { id } = req.userData;
    const { fields, files } = req;
    const { images = undefined } = files || {};

    const isValidData = await addProductSchema.safeParseAsync(fields);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const user = await userSchema.findById(id);

    const { name, company, description, variants, price, discount, stock } =
      isValidData.data;

    let product = await productSchema.create({
      name,
      company,
      description,
      variants,
      price: +price,
      discount: discount ? +discount : 0,
      stock: +stock,
      shopId: user.addedBy,
    });

    if (Array.isArray(images) && images.length) {
      for (const image of images) {
        const response = await cloudinary.uploader.upload(image.path, {
          folder: "products",
          use_filename: true,
          unique_filename: false,
        });

        product = await productSchema.findByIdAndUpdate(
          { _id: product._id },
          {
            $push: { images: response.secure_url },
          },
          { new: true }
        );
      }
    }

    if (!Array.isArray(images) && images.name) {
      const { path } = images;
      const response = await cloudinary.uploader.upload(path, {
        folder: "products",
        use_filename: true,
        unique_filename: false,
      });

      product = await productSchema.findByIdAndUpdate(
        { _id: product._id },
        {
          $push: { images: response.secure_url },
        },
        { new: true }
      );
    }

    return res.json({
      success: true,
      message: "Product added successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductListController = async (req, res) => {
  try {
    const { shopId } = req.params;

    const products = await productSchema.find({ shopId });

    return res.json({
      success: true,
      message: "Product list found",
      data: {
        products,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productSchema.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product found",
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId, shopId } = req.params;
    const isValidData = await addProductSchema.safeParseAsync(req.body);

    if (!isValidData.success)
      return res.status(400).json({
        success: false,
        message: isValidData.error.issues[0].message,
      });

    const existingProduct = await productSchema.findOne({
      _id: productId,
      shopId,
    });

    if (!existingProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    const { name, company, description, variants, price, discount, stock } =
      isValidData.data;

    const updatedProduct = await productSchema.findByIdAndUpdate(
      { _id: productId },
      {
        name,
        company,
        description,
        variants,
        price: +price,
        discount: discount ? +discount : 0,
        stock: +stock,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: {
        product: updatedProduct,
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
  addProduct,
  updateProduct,
  getProductListController,
  getSingleProductController,
};
