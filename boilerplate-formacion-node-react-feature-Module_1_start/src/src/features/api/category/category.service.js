const { Category } = require('../../../models');

const toPublic = (category) => category.toJSON();

const getCategories = async (filters, options) =>
  Category.findAll({ where: filters, order: options.order });

const getCategory = async (uuid) => {
  return Category.findOne({ where: { uuid } });
};

const createCategory = async (data) => {
  //const dataToCreate = { ...data };
  const category = await Category.create(data);
  return category.save();
};

const putCategory = async (uuid, data) => {
  const category = await getCategory(uuid);
  return cart.update(data);
};

const deleteCategory = async (category) => category.destroy();

module.exports = {
  toPublic,
  getCategories,
  getCategory,
  createCategory,
  putCategory,
  deleteCategory,
};
