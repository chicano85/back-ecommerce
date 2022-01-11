const boom = require('@hapi/boom');
const logger = require('../../../config/winston');
const queryOptions = require('../../../utils/queryOptions');

const activityService = require('../activity/activity.service');
const orderService = require('./order.service');
const productService = require('../product/product.service');
const activityActions = require('./order.activity');
const orderFilters = require('./order.filters');
const orderProductService = require('../orderProduct/orderProduct.service');

const listOrders = async (req, res, next) => {
  try {
    const filters = orderFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await orderService.getOrders(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createOrder = async (req, res, next) => {
  const orderData = req.body;

  // Le asignamos el usuario que ha realizado la petición
  orderData.user_uuid = orderData.userUuid || req.user.uuid; // req.user.uuid = Usuario que está logueado en ese momento

  // Inicializamos el precio de los pedidos

  //orderData.totalPrice = 0;
  orderData.price = 0;
  delete orderData.userUuid;

  let order;
  try {
    order = await orderService.createOrder(orderData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  const orderUuid = order.uuid;
  const orderProductsForOrder = [];
  let totalPrice = 0;

  try {
    for (const product of orderData.products) {
      const productInDatabase = await productService.getProduct(product);
      delete productInDatabase.uuid;

      const orderProduct = {
        ...productInDatabase.get(),
        order_uuid: orderUuid,
      };

      totalPrice += productInDatabase.price;

      orderProductsForOrder.push(await orderProductService.createOrderProduct(orderProduct));
    }

    await orderService.putOrder(orderUuid, {
      ...order,
      price: totalPrice,
    });
  } catch (error) {
    try {
      //Para evitar datos huerfanos en la BBDD en caso de error
      await orderService.deleteOrder(order);

      for (const orderProduct of orderProductsForOrder) {
        await orderProductService.deleteOrderProduct(orderProduct);
      }
    } catch (rollbackError) {
      logger.error(`${rollbackError}`);
    }

    logger.error(`${error}`);
    return next(boom.badData(error, message));
  }

  try {
    order = await orderService.getOrder(orderUuid);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_ORDER,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(order.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(orderService.toPublic(order));
};

const getOrder = async (req, res, next) => {
  try {
    if (res.locals && res.locals.order) {
      return res.json(await orderService.toPublic(res.locals.order));
    }
    res.json(await orderService.toPublic(req.order));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const cancelOrder = async (req, res, next) => {
  let { order } = res.locals;
  const { cancelReason } = req.body;

  try {
    if (order.status !== orderService.ORDER_STATUS_WAITING) {
      return next(boom.badData('Solo se pueden cancelar los pedidos con estado en espera'));
    }

    order = await orderService.cancelOrder(order.uuid, cancelReason);

    res.json(await orderService.toPublic(order));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

module.exports = {
  listOrders,
  createOrder,
  getOrder,
  cancelOrder,
};
