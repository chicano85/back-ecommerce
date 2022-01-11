const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');

const { UniqueConstraintError } = require('sequelize');
const logger = require('../../../config/winston');
const queryOptions = require('../../../utils/queryOptions');

const activityService = require('../activity/activity.service');
const productService = require('./product.service');
const activityActions = require('./product.activity');
const productFilters = require('./product.filters');

const listProducts = async (req, res, next) => {
  try {
    const filters = productFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await productService.getProducts(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const getProduct = async (req, res, next) => {
  try {
    if (res.locals && res.locals.product) {
      return res.json(await productService.toPublic(res.locals.product));
    }
    res.json(await productService.toPublic(req.user));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createProduct = async (req, res, next) => {
  const productData = req.body;
  let product;
  try {
    product = await productService.createProduct(productData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe este producto'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_PRODUCT,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(product.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(productService.toPublic(product));
};

const putProduct = async (req, res, next) => {
  let { product } = req;
  if (res.locals && res.locals.product) {
    user = res.locals.product;
  }

  const productData = req.body;
  let response;

  try {
    const productUuid = product.uuid;
    delete productData.uuid;
    response = await productService.putProduct(productUuid, productData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_PRODUCT,
      elementBefore: JSON.stringify(product.toJSON()),
      elementAfter: JSON.stringify(response.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(productService.toPublic(response));
};

const deleteProduct = async (req, res, next) => {
  const { product } = res.locals;
  const productBeforeDelete = cloneDeep(product);

  try {
    await productService.deleteProduct(product, req.product._id);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.DELETE_PRODUCT,
      author: req.product.toJSON(),
      elementBefore: productBeforeDelete.toJSON(),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  putProduct,
  deleteProduct,
};
