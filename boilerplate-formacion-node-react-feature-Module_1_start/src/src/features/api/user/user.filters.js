const { Op } = require('sequelize');

module.exports = (params) => {
  const query = {};

  const orCondition = [];

  if (params.name) {
    orCondition.push = {
      name: {
        [Op.like]: `%${params.name}%`,
      },
    };

    orCondition.push({
      '$billing.nif': { [Op.like]: `%${params.name}%` },
    });
  }

  query.delete = { [Op.ne]: true };
  query[Op.or] = orCondition;

  return query;
};
