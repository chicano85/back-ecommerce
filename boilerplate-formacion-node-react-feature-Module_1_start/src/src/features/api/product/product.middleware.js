const boom = require('@hapi/boom');
const productService = require('./product.service');
const logger = require('../../../config/winston');

async function loadProduct(req, res, next) {
  const { productUuid } = req.params;
  let product;

  if (!productUuid) {
    return next(boom.badData('El identificador es obligatorio'));
  }

  try {
    product = await productService.getProduct(productUuid);
  } catch (error) {
    return next(boom.notFound('Producto no encontrado'));
  }

  if (!product) return next(boom.notFound('Producto no encontrado'));
  res.locals.product = product;

  next();
}

module.exports = {
  loadProduct,
};
