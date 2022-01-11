const { parse } = require('dotenv');
const { Op } = require('sequelize');

module.exports = (params) => {
  const query = {};

  if (params.name) {
    query.name = {
      [Op.like]: `%${params.name}%`,
    };
  }

  if (params.limit) {
    if (parseInt(params.limit) === -1) {
      query.limit = null,
      query.page = null;
      const offset = null;
      query.offset = offset;
    } else {
      if (parseInt(params.limit > 50)){
        params.limit = 50;
      }
      query.limit = parseInt(params.limit),
      query.page = parseInt(params.page);
      const offset = (parseInt(params.page) = 1) * params.limit;
      query.offset = offset;
    }
  } else {
    query.limit = 10;
    query.page = 1;
    const offset = 0;
    query.offset = offset;
  }

  query.deleted = { [Op.ne]: true };

  return query;
};
