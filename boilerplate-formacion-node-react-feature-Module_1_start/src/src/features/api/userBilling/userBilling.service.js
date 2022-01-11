const { UserBilling } = require('../../../models');
// eslint-disable-next-line prettier/prettier

const toPublic = (userBilling) => userBilling.toJSON();

const getUserBilling = async (uuid) =>
  UserBilling.findOne({
    where: {
      uuid,
    },
  });

const getUserBillings = (filters, options) =>
  UserBilling.findAll({
    where: filters,
    order: options.order,
  });

const createUserBilling = async (data) => {
  //const dataToCreate = { ...data, token: '' };
  const userBilling = await UserBilling.create(data);
  return userBilling.save();
};

const putUserBilling = async (uuid, data) => {
  const userBilling = await getUserBilling(uuid);
  return userBilling.update(data);
};

module.exports = {
  toPublic,
  getUserBilling,
  getUserBillings,
  createUserBilling,
  putUserBilling,
};
