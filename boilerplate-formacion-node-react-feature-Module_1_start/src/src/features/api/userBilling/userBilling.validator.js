/* eslint-disable linebreak-style */ /* eslint-disable prettier/prettier */

const joi = require('joi');
const { validate } = require('express-validation');

const createUserBilling = validate(
  {
    body: joi.object({
      nif: joi.string().alphanum().min(1).max(30).required(),
      address: joi.string(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const putUserBilling = validate(
  {
    body: joi.object({
      nif: joi.string().alphanum().min(3).max(30),
      address: joi.string(),
    }),
  },
  {
    context: false,
    statusCode: 422,
    keyByField: true,
  },
);

const deleteUserBilling = validate(
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
  createUserBilling,
  putUserBilling,
  deleteUserBilling,
};
