const { Product } = require('../../../models');
const logger = require('../../../config/winston');
//const sendinblue = require('../../../utils/lib/email');

const toPublic = (product) => product.toJSON();

const getProducts = async (filters, options) =>
  Product.findAndCountAll({
    order: options.order,
    limit: filters.limit,
    offset: filters.offset,
  })
    .then((res) => {
      res.perPage = filters.limit;
      res.page = filters.page;
      res.totalPages = Math.ceil(res.count / filters.limit);
      res.total = res.count;
      res.data = res.rows;
      delete res.count;
      delete res.rows;
      return res;
    })
    .catch((error) => console.log(error));

const getProduct = async (uuid) => {
  console.log(uuid);
  return Product.findOne({ where: { uuid } });
};

const createProduct = async (data) => {
  const dataToCreate = { ...data, token: '' };
  const product = await Product.create(dataToCreate);
  return product.save();
};

const putProduct = async (uuid, data) => {
  const product = await getProduct(uuid);
  return product.update(data);
};

const deleteProduct = async (product) => product.destroy();

module.exports = {
  toPublic,
  getProducts,
  getProduct,
  createProduct,
  putProduct,
  deleteProduct,
};
