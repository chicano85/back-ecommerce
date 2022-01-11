const boom = require('@hapi/boom');
const { cloneDeep } = require('lodash');

const { UniqueConstraintError } = require('sequelize');
const logger = require('../../../config/winston');
const queryOptions = require('../../../utils/queryOptions');

const activityService = require('../activity/activity.service');
const categoryService = require('./category.service');
const activityActions = require('./category.activity');
const categoryFilters = require('./category.filters');

const listCategories = async (req, res, next) => {
  try {
    const filters = categoryFilters(req.query);
    const options = queryOptions(req.query);

    res.json(await categoryService.getCategory(filters, options));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const getCategory = async (req, res, next) => {
  try {
    if (res.locals && res.locals.category) {
      return res.json(await categoryService.toPublic(res.locals.category));
    }
    res.json(await categoryService.toPublic(req.user));
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }
};

const createCategory = async (req, res, next) => {
  const categoryData = req.body;
  let category;
  try {
    category = await categoryService.createCategory(categoryData);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(boom.badData('Ya existe esta categoría'));
    }
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.CREATE_CATEGORY,
      author: req.user.email,
      elementBefore: JSON.stringify({}),
      elementAfter: JSON.stringify(category.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(201).json(categoryService.toPublic(category));
};

const putCategory = async (req, res, next) => {
  let { category } = req;
  if (res.locals && res.locals.category) {
    user = res.locals.category;
  }

  const categoryData = req.body;
  let response;

  try {
    const categoryUuid = category.uuid;
    delete categoryData.uuid;
    response = await categoryService.putCategory(categoryUuid, categoryData);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badData(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.UPDATE_CATEGORY,
      elementBefore: JSON.stringify(category.toJSON()),
      elementAfter: JSON.stringify(response.toJSON()),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.json(categoryService.toPublic(response));
};

const deleteCategory = async (req, res, next) => {
  const { category } = res.locals;
  const categoryBeforeDelete = cloneDeep(category);

  try {
    await categoryService.deleteCategory(category, req.category._id);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.badImplementation(error.message));
  }

  try {
    await activityService.createActivity({
      action: activityActions.DELETE_CATEGORY,
      author: req.category.toJSON(),
      elementBefore: categoryBeforeDelete.toJSON(),
    });
  } catch (error) {
    logger.error(`${error}`);
  }

  res.status(204).json({});
};

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  putCategory,
  deleteCategory,
};
