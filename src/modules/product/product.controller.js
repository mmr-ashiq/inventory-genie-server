const { addProductSchema } = require('./product.dto');
const productSchema = require('../models/product.model');
const userSchema = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

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
          folder: 'products',
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
        folder: 'products',
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
      message: 'Product added successfully',
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

const getProductList = async (req, res) => {
  try {
    const { shopId } = req.params;

    const products = await productSchema.find({ shopId });

    return res.json({
      success: true,
      message: 'Product list found',
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

const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productSchema.findById(productId);

    if (!product) {
      return res.json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      message: 'Product found',
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
        message: 'Product not found',
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
      message: 'Product updated successfully',
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

// sell products to customer by admin
const sellProductsToCustomer = async (req, res) => {
  try {
    const { products, customer, paidPrice } = req.body;

    if (!products || !customer)
      return res.status(400).json({
        success: false,
        message: 'Products and customer are required',
      });

    // check if products is an array
    if (!Array.isArray(products) || products.length === 0)
      return res.status(400).json({
        success: false,
        message:
          'Products must be an array and must contain at least one product',
      });

    // check if customer exists
    const existingCustomer = await userSchema.findOne({ _id: customer });

    if (!existingCustomer)
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });

    const productIds = products.map((product) => product);

    const productsSearch = await productSchema.find({
      _id: { $in: productIds },
    });

    // check if every product exists and is in stock
    const productsNotInStock = productsSearch.filter(
      (product) => product.stock < 1 || !product.stock
    );

    if (productsNotInStock.length)
      return res.status(400).json({
        success: false,
        message: 'Some products are not in stock',
        data: {
          products: productsNotInStock,
        },
      });

    // check if products requested quantity is less than or equal to stock
    // const productsQuantityExceeded = productsSearch.filter(
    //   (productSearch) =>
    //     productSearch.stock < products.filter((p) => productSearch._id.toString() === p)
    // );

    // if (productsQuantityExceeded.length)
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Some products quantity exceeded',
    //     data: {
    //       products: productsQuantityExceeded,
    //     },
    //   });

    // console.log('productsSearch', productsSearch);

    const uniqueProducts = {};

    products.forEach((product) => {
      const productDetails = productsSearch.find(
        (productSearch) => productSearch._id.toString() === product
      );

      console.log('productDetails', productDetails);

      const discountedPrice =
        productDetails.price -
        (productDetails.price * productDetails.discount) / 100;

      if (!uniqueProducts[product]) {
        const details = {
          id: productDetails._id,
          name: productDetails.name,
          company: productDetails.company,
          price: productDetails.price,
          discount: productDetails.discount,
          quantity: 1,
          totalPrice: discountedPrice,
        };

        uniqueProducts[product] = details;

        return;
      }

      if (uniqueProducts[product]) {
        const details = {
          id: productDetails._id,
          name: productDetails.name,
          company: productDetails.company,
          price: productDetails.price,
          discount: productDetails.discount,
          quantity: uniqueProducts[product].quantity + 1,
          totalPrice: uniqueProducts[product].totalPrice + discountedPrice,
        };

        uniqueProducts[product] = details;

        return;
      }
    });

    // update stock of every product
    for (const product of productsSearch) {
      await productSchema.findByIdAndUpdate(
        { _id: product._id },
        {
          stock: product.stock - 1,
        },
        { new: true }
      );
    }

    return res.json({
      success: true,
      message: 'Product list found',
      data: {
        products: productsSearch,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// product search and filter controller
const productSearchAndFilter = async (req, res) => {
  try {
    const limit = Number(req.query?.limit) || 20;
    const page = Number(req.query?.page) || 1;
    const lower_limit = Number(req.query?.lower_limit) || 0;
    const upper_limit = Number(req.query?.upper_limit) || 0;
    const search = req.query?.search || '';

    const productsSearch = await productSchema.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
          ],
          ...((lower_limit || upper_limit) && {
            price: {
              ...(lower_limit && { $gte: +lower_limit }),
              ...(upper_limit && { $lte: +upper_limit }),
            },
          }),
        },
      },
      {
        $facet: {
          paginatedResults: [{ $skip: limit * (page - 1) }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const products = productsSearch[0].paginatedResults;
    const [totalCount] = productsSearch[0].totalCount;

    return res.json({
      success: true,
      message: 'Product list found',
      data: {
        totalCount: totalCount?.count || 0,
        products,
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
  getProductList,
  getSingleProduct,
  sellProductsToCustomer,
  productSearchAndFilter
};
