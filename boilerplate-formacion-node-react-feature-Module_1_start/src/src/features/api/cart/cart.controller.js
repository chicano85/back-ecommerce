const boom = require('@hapi/boom');

const { UniqueConstraintError } = require('sequelize');

const logger = require('../../../config/winston');
const queryOptions = require('../../../utils/queryOptions');

const { Product, ProductCart } = require('../../../models');

const activityService = require('../activity/activity.service');
const cartService = require('./cart.service');
const productService = require('../product/product.service');
const activityActions = require('./cart.activity');
const cartFilters = require('./cart.filters');
const productCartService = require('../productCart/productCart.service');
const orderProductService = require('../orderProduct/orderProduct.service');
const orderService = require('../order/order.service');
const sendinblue = require('../../../utils/lib/email');

const { productCart } = require('../../../models/');

const listCarts = async (req, res, next) => {
  try {
    const filters = cartFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await cartService.getCarts(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createCart = async (req, res, next) => {
  const { user } = req;
  const cartData = req.body;
  let cart;
  const productCartList = [];

  // Le asignamos el usuario que ha realizado la petición o el usuario logueado en ese momento

  cartData.user_uuid = cartData.user_uuid || req.user.uuid;

  try {
    console.log(cartData);
    cart = await cartService.createCart(cartData);
    console.log('hola', cart);
  } catch (error) {
    console.log('Entro en el error directamente', error);
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe este carrito'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    console.log(cartData.products);
    for (const productUuid of cartData.products) {
      //const productInDatabase = await productService.getProduct(productUuid);
      //delete productInDatabase.uuid;
      console.log(productUuid);

      const productCart = {
        CartUuid: cart.uuid,
        ProductUuid: productUuid,
      };
      console.log(productCart);
      productCartList.push(await productCartService.createProductCart(productCart));
    }
  } catch (error) {
    console.log(error);
    try {
      await cartService.deleteCart(cart);

      for (const oneProductCart of productCartList) {
        await productCartService.deleteProductCart(oneProductCart);
      }
    } catch (rollbackError) {
      logger.error(`${rollbackError}`);
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_CART,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(cart.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(cartService.toPublic(cart));
};

const getCart = async (req, res, next) => {
  try {
    if (res.locals && res.locals.cart) {
      return res.json(await cartService.toPublic(res.locals.cart));
    }
    res.json(await cartService.toPublic(req.cart));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const putCart = async (req, res, next) => {
  let { user } = req;
  if (res.locals && res.locals.cart) {
    cart = res.locals.cart;
  }

  const cartData = req.body;
  let response;

  try {
    const cartUuid = cart.uuid;
    delete cartData.uuid;
    response = await cartService.putCart(cartUuid, cartData);
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

const deleteCart = async (req, res, next) => {
  const { user } = req;
  const cart = res.locals.cart;
  const productCartBefore = cart.productCart;

  if (user.uuid !== cart.user_uuid) {
    return next(
      boom.unauthorized('El carrito solo lo puede eliminar el mismo usuario que lo creo'),
    );
  }
  try {
    await deleteCartinProcess(productCartBefore, cart);
  } catch (error) {
    logger.error(`${error}`);
  }
  try {
    await activityService.createActivity({
      action: activityActions.DELETE_CART,
      author: req.user.toJSON(),
      elementBefore: JSON.stringify(cart.toJSON()),
      elementAfter: JSON.stringify({}),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

module.exports = {
  getCart,
  listCarts,
  createCart,
  getCart,
  putCart,
  deleteCart,
  //cartToOrder,
};
