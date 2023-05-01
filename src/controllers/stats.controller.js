import { productModel, productSoldModel } from '../models/product.model.js';

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
