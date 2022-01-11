const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const orderController = require('./order.controller');
const middleware = require('./order.middleware');
const validator = require('./order.validator');

// Ver un pedido

router.get(
  '/:orderUuid',
  authorization('orders:view'),
  middleware.loadOrder,
  orderController.getOrder,
);

// Listar los pedidos paginados

router.get('/', authorization('orders:view'), orderController.listOrders);

// Crear un pedido

router.post(
  '/',
  authorization('orders:create'),
  validator.createOrder,
  orderController.createOrder,
);

// Cancelar un pedido

router.post(
  '/:orderUuid/cancel',
  authorization('orders:delete'),
  validator.cancelOrder,
  middleware.loadOrder,
  orderController.cancelOrder,
);

module.exports = router;
