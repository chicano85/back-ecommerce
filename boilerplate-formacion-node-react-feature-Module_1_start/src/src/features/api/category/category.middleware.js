const boom = require('@hapi/boom');
const service = require('./category.service');

async function loadCategory(req, res, next) {
  const { categoryUuid } = req.params;
  let category;

  if (!categoryUuid) {
    return next(boom.badData('El identificador es obligatorio'));
  }

  try {
    category = await service.getCategory(categoryUuid);
  } catch (error) {
    return next(boom.notFound('Categoría no encontrada'));
  }

  if (!category) return next(boom.notFound('Categoría no encontrada'));
  res.locals.category = category;

  next();
}

module.exports = {
  loadCategory,
};
