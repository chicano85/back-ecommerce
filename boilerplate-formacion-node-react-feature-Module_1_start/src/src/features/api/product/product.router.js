const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const productController = require('./product.controller');
const middleware = require('./product.middleware');
const validator = require('./product.validator');

// Ver un producto

router.get(
  '/:productUuid',
  authorization('users:view'),
  middleware.loadProduct,
  productController.getProduct,
);

// Listar los productos paginados

router.get('/', authorization('users:view'), productController.listProducts);

// Crear un producto

router.post(
  '/',
  /*  (req, res, next) => {
    console.log('llega aquí');
    next();
  }, */
  authorization('users:create'),
  validator.createProduct,
  productController.createProduct,
);

// Editar un producto

router.put(
  '/:productUuid',
  authorization('users:update'),
  validator.putProduct,
  middleware.loadProduct,
  productController.putProduct,
);

// Borrar un producto

router.delete(
  '/:productUuid',
  authorization('users:delete'),
  validator.deleteProduct,
  middleware.loadProduct,
  productController.deleteProduct,
);

module.exports = router;
