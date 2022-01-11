const { ProductCart } = require('../../../models');

const toPublic = (productCart) => productCart.toJSON();

const getProductCarts = async (filters, options) =>
  ProductCart.findAll({ where: filters, cart: options.cart });

const getProductCart = async (uuid) =>
  ProductCart.findOne({
    where: {
      uuid,
    },
  });

/*  const createProductCart = async (cartUuid, productUuid) => {
  let dataToCreate = {
    ProductUuid: productUuid,
    CartUuid: cartUuid,
  }; */
const createProductCart = async (dataToCreate) => {
  console.log('holaaaaaaaa', dataToCreate);
  const productCart = await ProductCart.create(dataToCreate);
  return productCart.save();
};

const putProductCart = async (uuid, data) => {
  const productCart = await getProductCart(uuid);
  return productCart.update(data);
};

const deleteProductCart = async (productCart) => productCart.destroy();

module.exports = {
  toPublic,
  getProductCarts,
  getProductCart,
  createProductCart,
  putProductCart,
  deleteProductCart,
};
