const joi = require('joi');
const { validate } = require('express-validation');

const createCart = validate(
  {
    body: joi.object({
      products: joi.array().items(joi.string()).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putCart = validate(
  {
    body: joi.object({
      products: joi.array().items(joi.string()).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const createCartToOrder = validate(
  {
    body: joi.object({
      address: joi.string().required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

module.exports = {
  createCart,
  putCart,
  createCartToOrder,
};
