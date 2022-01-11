// eslint-disable-next-line no-unused-vars

const boom = require('@hapi/boom');
const service = require('./user.service');
const logger = require('../../../config/winston');

async function loadUser(req, res, next) {
  const { userUuid } = req.params;
  let user;

  if (!userUuid) {
    return next(boom.badData('El identificador es obligatorio'));
  }

  try {
    user = await service.getUser(userUuid);
  } catch (error) {
    return next(boom.notFound('User no encontrado'));
  }

  if (!user) return next(boom.notFound('User no encontrado'));
  res.locals.user = user;

  next();
}

async function isAdmin(req, res, next) {
  const { email } = req.body;
  let user;

  try {
    user = await service.getUserByEmail(email);
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.unauthorized('User no encontrado'));
  }
  if (!user) {
    return next(boom.unauthorized('El email y la contraseña no son válidos'));
  }

  try {
    const isUserAuthorized = await service.isUserAuthorized(user, 'SUPERADMIN');
    if (isUserAuthorized) {
      next();
    } else {
      return next(boom.unauthorized('El usuario no es Superadmin'));
    }
  } catch (error) {
    logger.error(`${error}`);
    return next(boom.unauthorized('El usuario no es Superadmin'));
  }
}

module.exports = {
  loadUser,
  isAdmin,
};
