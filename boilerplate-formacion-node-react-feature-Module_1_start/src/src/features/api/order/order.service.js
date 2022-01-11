const { Order, User, OrderProduct } = require('../../../models');

const ORDER_STATUS_WAITING = 0;
const ORDER_STATUS_PROCESSING = 1;
const ORDER_STATUS_CANCELED = 2;

const toPublic = (order) => order.toJSON();

const getOrders = async (filters, options) =>
  Order.findAll({ where: filters, order: options.order });

const getOrder = async (uuid) => {
  console.log(uuid);
  return Order.findOne({ where: { uuid } });
};

const createOrder = async (data) => {
  //const dataToCreate = { ...data };
  const order = await Order.create(data);
  return order.save();
};

const putOrder = async (uuid, data) => {
  const order = await getOrder(uuid);
  return order.update(data);
};

const deleteOrder = async (order) => order.destroy();

const cancelOrder = async (uuid, cancelReason) => {
  const data = {
    status: ORDER_STATUS_CANCELED,
  };

  if (cancelReason) {
    data.cancelReason = cancelReason;
  }
  return putOrder(uuid, data);
};

module.exports = {
  toPublic,
  getOrders,
  getOrder,
  createOrder,
  putOrder,
  deleteOrder,
  cancelOrder,
  ORDER_STATUS_WAITING,
  ORDER_STATUS_PROCESSING,
  ORDER_STATUS_CANCELED,
};
