const joi = require('joi');
const { validate } = require('express-validation');

const createProduct = validate(
  {
    body: joi.object({
      name: joi.string().min(3).max(50).required(),
      price: joi.number().required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putProduct = validate(
  {
    body: joi.object({
      name: joi.string().min(3).max(30),
      price: joi.number(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const deleteProduct = validate(
  {
    body: joi.object({}),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

module.exports = {
  createProduct,
  putProduct,
  deleteProduct,
};
