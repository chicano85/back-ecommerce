const express = require('express');

const router = express.Router();

const authorization = require('../../../utils/middleware/authorization');
const categoryController = require('./category.controller');
const middleware = require('./category.middleware');
const validator = require('./category.validator');

// Ver una categoría

router.get(
  '/:categoryUuid',
  authorization('categories:view'),
  middleware.loadCategory,
  categoryController.getCategory,
);

// Listar las categorías

router.get('/', authorization('categories:view'), categoryController.listCategories);

// Crear una categoría

router.post(
  '/',
  authorization('categories:create'),
  validator.createCategory,
  categoryController.createCategory,
);

// Editar una categoría

router.put(
  '/:categoryUuid',
  authorization('categories:update'),
  validator.putCategory,
  middleware.loadCategory,
  categoryController.putCategory,
);

// Borrar una categoría

router.delete(
  '/:categoryUuid',
  authorization('categories:delete'),
  validator.deleteCategory,
  middleware.loadCategory,
  categoryController.deleteCategory,
);

module.exports = router;
