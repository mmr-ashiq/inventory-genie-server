const express = require('express');

const { isAuthorized } = require('../middlewares/auth.middlewares');
const { multipleFileUpload } = require('../middlewares/fileUpload.middlewares');
const {
    addProduct,
    getProductList,
    getSingleProduct,
    updateProduct,
    productSearchAndFilter,
    sellProductsToCustomer,
} = require('../controllers/product.controller');

const router = express.Router();

router.post(
  '/products',
  isAuthorized({
    allowedRole: ['admin'],
  }),
  multipleFileUpload(),
  addProductController
);
router.get(
  '/products/:shopId',
  isAuthorized({
    allowedRole: ['admin'],
  }),
  getProductListController
);
router.get(
  '/products/:productId/single',
  isAuthorized({
    allowedRole: ['admin'],
  }),
  getSingleProductController
);

router.put(
  '/shop/:shopId/products/:productId',
  isAuthorized({
    allowedRole: ['admin'],
  }),
  updateProductController
);

router.get(
  '/products',
  isAuthorized({
    allowedRole: ['admin', 'customer', 'manager'],
  }),
  productSearchAndFilterController
);

router.post(
  '/products/sell',
  isAuthorized({
    allowedRole: ['admin'],
  }),
  sellProductsToCustomerController
);

module.exports = router;