const joi = require('joi');
const { validate } = require('express-validation');

const createCategory = validate(
  {
    body: joi.object({
      name: joi.string().min(3).max(50).required(),
      slug: joi.string().min(3).max(50),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putCategory = validate(
  {
    body: joi.object({
      name: joi.string().min(3).max(50).required(),
      slug: joi.string().min(3).max(50).required(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const deleteCategory = validate(
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
  createCategory,
  putCategory,
  deleteCategory,
};
