const { OrderProduct } = require('../../../models');

const toPublic = (orderProduct) => orderProduct.toJSON();

const getOrderProducts = async (filters, options) =>
  OrderProduct.findAll({ where: filters, order: options.order });

const getOrderProduct = async (uuid) =>
  OrderProduct.findOne({
    where: {
      uuid,
    },
  });

const createOrderProduct = async (data) => {
  console.log(data);
  const dataToCreate = {
    productName: data.name,
    productPrice: data.price,
    productUuid: data.uuid,
    order_uuid: data.order_uuid,
  };
  const orderProduct = await OrderProduct.create(dataToCreate);
  return orderProduct.save();
};

const putOrderProduct = async (uuid, data) => {
  const orderProduct = await getOrderProduct(uuid);
  return orderProduct.update(data);
};

const deleteOrderProduct = async (orderProduct) => orderProduct.destroy();

module.exports = {
  toPublic,
  getOrderProducts,
  getOrderProduct,
  createOrderProduct,
  putOrderProduct,
  deleteOrderProduct,
};
