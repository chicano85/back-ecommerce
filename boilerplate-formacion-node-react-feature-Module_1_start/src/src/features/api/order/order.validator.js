const joi = require('joi');
const { validate } = require('express-validation');

const createOrder = validate(
  {
    body: joi.object({
      products: joi.array().items(joi.string()).required(),
      userUuid: joi.string().uuid(),
      address: joi.string().required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const cancelOrder = validate(
  {
    body: joi.object({
      cancelReason: joi.string().max(200),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

module.exports = {
  createOrder,
  cancelOrder,
};
