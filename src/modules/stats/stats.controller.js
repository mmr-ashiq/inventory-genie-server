import { customerModel, vendorModel } from '../platform-users/user.model.js';
import { productModel, productSoldModel } from '../products/product.model.js';

/**
 * Get top six products by total sell in a month
 * @param {*} req request object
 * @param {*} res response object
 * @returns response object with top six products data and message
 */
export const getTopSixProductsController = async (req, res) => {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;

    const allSoldProducts = await productSoldModel.find({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), month - 1, 1),
        $lt: new Date(new Date().getFullYear(), month, 1),
      },
    });

    const allProducts = allSoldProducts.map((soldProduct) => {
      return soldProduct.products;
    });

    // flatten array
    const flattenProducts = allProducts.flat();

    const mergedProducts = flattenProducts.reduce((acc, product) => {
      const existingProduct = acc.find(
        (p) => p.productId.toString() === product.productId.toString()
      );

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        acc.push(product);
      }

      return acc;
    }, []);

    const sortedProducts = mergedProducts.sort((a, b) => b.quantity - a.quantity).slice(0, 6);

    // find product details
    const products = await productModel.find({
      _id: {
        $in: sortedProducts.map((product) => product.productId),
      },
    });

    const formattedData = sortedProducts.map((product) => {
      const existingProduct = products.find(
        (p) => p._id.toString() === product.productId.toString()
      );

      return {
        productId: product.productId,
        quantity: product.quantity,
        name: existingProduct.name,
        description: existingProduct.description,
        price: existingProduct.price,
        company: existingProduct.company,
        stock: existingProduct.stock,
      };
    });

    return res.status(200).json({
      message: 'Top six products fetched successfully',
      data: {
        products: formattedData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * Get yearly sell report by month
 * @param {*} req request object
 * @param {*} res response object
 * @returns response object with yearly sell report data and message
 */
export const yearlySellReportController = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const allSoldProducts = await productSoldModel.find({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });

    const allProductsObjects = allSoldProducts.map((soldProduct) => {
      return soldProduct.products.map((product) => {
        return {
          productId: product.productId,
          quantity: product.quantity,
          createdAt: soldProduct.createdAt,
        };
      });
    });

    // flatten array
    let flattenProducts = allProductsObjects.flat();

    const mergedProducts = flattenProducts.reduce((acc, product) => {
      const existingProduct = acc.find(
        (p) => p.productId.toString() === product.productId.toString()
      );

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        acc.push(product);
      }

      return acc;
    }, []);

    const productDetails = await productModel.find({
      _id: {
        $in: mergedProducts.map((product) => product.productId),
      },
    });

    // separate products by month
    const productsByMonth = flattenProducts.reduce((acc, product) => {
      const month = product.createdAt.getMonth();

      if (acc[month]) {
        acc[month].push(product);
      } else {
        acc[month] = [product];
      }

      return acc;
    }, {});

    const formattedData = Object.keys(productsByMonth).map((month) => {
      const products = productsByMonth[month];

      const totalSell = products.reduce((acc, product) => {
        const existingProduct = productDetails.find(
          (p) => p._id.toString() === product.productId.toString()
        );

        return acc + product.quantity * existingProduct.price;
      }, 0);

      return {
        month: Number(month) + 1,
        totalSell,
      };
    });

    return res.status(200).json({
      message: 'Yearly sell report fetched successfully',
      data: {
        report: formattedData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * Get top six customers by total purchase
 * @param {*} req request object
 * @param {*} res response object
 * @returns response object with top six customers data and message 
 */
export const getTopCustomerController = async (req, res) => {
  try {
    const allSoldProducts = await productSoldModel.find({
      // createdAt: {
      //   $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      //   $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      // },
    });

    const allProducts = allSoldProducts.map((soldProduct) => {
      return soldProduct.products.map((product) => {
        return {
          productId: product.productId,
          quantity: product.quantity,
          customerId: soldProduct.customerId,
        };
      });
    });

    // flatten array
    const flattenProducts = allProducts.flat();

    const mergedProducts = flattenProducts.reduce((acc, product) => {
      const existingProduct = acc.find(
        (p) => p.productId.toString() === product.productId.toString()
      );

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        acc.push(product);
      }

      return acc;
    }, []);

    const sortedProducts = mergedProducts.sort((a, b) => b.quantity - a.quantity).slice(0, 6);

    // find customer details from sortedProducts
    const customers = await customerModel.find({
      _id: {
        $in: sortedProducts.map((product) => product.customerId),
      },
    });

    const formattedData = sortedProducts.map((product) => {
      const existingCustomer = customers.find(
        (c) => c._id.toString() === product.customerId.toString()
      );

      // count total bought products by customer
      // const totalBoughtProducts = flattenProducts.reduce((acc, product) => {
      //   if (product.customerId.toString() === existingCustomer._id.toString()) {
      //     acc += product.quantity;
      //   }

      //   return acc;
      // }, 0);

      return {
        customerId: product.customerId,
        quantity: product.quantity,
        firstName: existingCustomer.firstName,
        lastName: existingCustomer.lastName,
        email: existingCustomer.email,
        phone: existingCustomer.phone,
      };
    });

    const customerMerge = formattedData.reduce((acc, customer) => {
      const existingCustomer = acc.find(
        (c) => c.customerId.toString() === customer.customerId.toString()
      );

      if (existingCustomer) {
        existingCustomer.quantity += customer.quantity;
      } else {
        acc.push(customer);
      }

      return acc;
    }, []);

    return res.status(200).json({
      message: 'Top six products fetched successfully',
      data: {
        customers: customerMerge,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * get top ten customers who have the most due amount
 * @param {*} req request object
 * @param {*} res response object
 * @returns {object} response object with message and data property containing customers array
 */
export const getMostDueCustomerController = async (req, res) => {
  try {
    // get top tem customers who have the most due amount
    const allCustomers = await productSoldModel.aggregate([
      {
        $group: {
          _id: '$customerId',
          totalDue: { $sum: '$duePrice' },
        },
      },
      {
        $sort: {
          totalDue: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    const customers = await customerModel.find({
      _id: {
        $in: allCustomers.map((customer) => customer._id),
      },
    });

    const formattedData = allCustomers.map((customer) => {
      const existingCustomer = customers.find((c) => c._id.toString() === customer._id.toString());

      return {
        customerId: customer._id,
        totalDue: customer.totalDue,
        firstName: existingCustomer.firstName,
        lastName: existingCustomer.lastName,
        email: existingCustomer.email,
        phone: existingCustomer.phone,
      };
    });

    return res.status(200).json({
      message: 'Top ten customers fetched successfully',
      data: {
        customers: formattedData,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * get top ten vendors who have the most quantity of products
 * @param {*} req request object
 * @param {*} res response object
 * @returns {object} response object with data and message property containing top ten vendors 
 */
export const getTopVendorsController = async (req, res) => {
  try {
    // get top ten vendors who have the most quantity of products
    const stockIns = await stockInModel.aggregate([
      {
        $group: {
          _id: '$vendor',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    console.log(stockIns);
    const vendors = await vendorModel.find({
      _id: {
        $in: stockIns.map((stockIn) => stockIn._id),
      },
    });

    const formattedData = stockIns.map((stockIn) => {
      const existingVendor = vendors.find((v) => v._id.toString() === stockIn._id.toString());

      return {
        vendorId: stockIn._id,
        totalQuantity: stockIn.totalQuantity,
        firstName: existingVendor.firstName,
        lastName: existingVendor.lastName,
        email: existingVendor.email,
        phone: existingVendor.phone,
      };
    });

    return res.status(200).json({
      message: 'Top ten vendors fetched successfully',
      data: {
        vendors: formattedData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * Get top ten vendors who have the most due amount from customers
 * @param {*} req request object
 * @param {*} res response object
 * @returns top ten vendors who have the most due amount from customers
 */
export const getTopVendorsWithDueController = async (req, res) => {
  try {
    const stockIns = await stockInModel.aggregate([
      {
        $group: {
          _id: '$vendor',
          totalDue: { $sum: '$dueAmount' },
        },
      },
      {
        $sort: {
          totalDue: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    const vendors = await vendorModel.find({
      _id: {
        $in: stockIns.map((stockIn) => stockIn._id),
      },
    });

    const formattedData = stockIns.map((stockIn) => {
      const existingVendor = vendors.find((v) => v._id.toString() === stockIn._id.toString());

      return {
        vendorId: stockIn._id,
        totalDue: stockIn.totalDue,
        firstName: existingVendor.firstName,
        lastName: existingVendor.lastName,
        email: existingVendor.email,
        phone: existingVendor.phone,
      };
    });

    return res.status(200).json({
      message: 'Top ten vendors fetched successfully',
      data: {
        vendors: formattedData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * get total sales amount of the shop in last 30 days from today
 * @param {*} req request object
 * @param {*} res response object
 * @returns  total sales amount of the shop
 */
export const getTotalSalesAmountController = async (req, res) => {
  try {
    const totalSales = await productSoldModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },

      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    return res.status(200).json({
      message: 'Total sales amount fetched successfully',
      data: {
        totalSales: totalSales[0].totalSales,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * get total due amount of the shop in last 30 days from today
 * @param {*} req request object  
 * @param {*} res response object
 * @returns total due amount of the shop
 */
export const getTotalDueAmountController = async (req, res) => {
  try {
    const totalDue = await stockInModel.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: '$dueAmount' },
        },
      },
    ]);

    return res.status(200).json({
      message: 'Total due amount fetched successfully',
      data: {
        totalDue: totalDue[0].totalDue,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};