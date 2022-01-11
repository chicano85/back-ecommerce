const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const cartController = require('./cart.controller');
const middleware = require('./cart.middleware');
const validator = require('./cart.validator');

// Ver un carrito

router.get('/:cartUuid', authorization('carts:view'), middleware.loadCart, cartController.getCart);

// Listar los carritos paginados

router.get('/', authorization('carts:view'), cartController.listCarts);

// Crear un carrito

router.post('/', authorization('carts:create'), validator.createCart, cartController.createCart);

// Pasar de carrito a pedido

/* router.post(
  '/:cartUuid/cartToOrder',
  authorization('carts:update'),
  validator.createCartToOrder,
  cartController.cartToOrder,
); */

module.exports = router;
