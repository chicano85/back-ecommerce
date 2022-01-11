const { Cart } = require('../../../models');
const CART_STATUS_PROCESSING = 0;
const CART_STATUS_COMPLETED = 1;

const toPublic = (cart) => cart.toJSON();

const getCarts = async (filters, options) =>
  Cart.findAll({ where: filters, order: options.order })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => {
      throw new Error(err.message);
    });

/* const getCart = async (uuid) => {
  console.log(uuid);
  return Cart.findOne({ where: { uuid } });
};
 */

const getCart = async (uuid) => {
  Cart.findOne({ where: { uuid } });
};

const createCart = async (data) => {
  const cart = await Cart.create(data);
  return cart.save();
};

const putCart = async (uuid, data) => {
  const cart = await getCart(uuid);
  return cart.update(data);
};

const deleteCart = async (cart) => cart.destroy();

const cartToOrder = async (uuid) => {
  const data = {
    state: CART_STATUS_COMPLETED,
  };
  return putCart(uuid, data);
};

module.exports = {
  toPublic,
  getCarts,
  getCart,
  createCart,
  putCart,
  deleteCart,
  cartToOrder,
  CART_STATUS_PROCESSING,
  CART_STATUS_COMPLETED,
};
