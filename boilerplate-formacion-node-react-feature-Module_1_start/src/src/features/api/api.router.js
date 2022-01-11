const userController = require('./user/user.controller');
const { authorize } = require('../../utils/middleware/jwt');

const tag = 'api/v1';

// eslint-disable-next-line no-unused-vars
module.exports = (app) => {
  // eslint-disable-next-line global-require
  app.use(`/${tag}/auth`, require('./auth/auth.router'));
  app.get(`/${tag}/auth/profile`, authorize, userController.getUser);
  app.put(`/${tag}/auth/profile`, authorize, userController.putUser);

  app.use(`/${tag}/users`, authorize, require('./user/user.router'));
  app.use(`/${tag}/users-groups`, authorize, require('./userGroup/userGroup.router'));
  app.use(`/${tag}/activity`, authorize, require('./activity/activity.router'));
  app.use(`/${tag}/products`, authorize, require('./product/product.router'));
  app.use(`/${tag}/orders`, authorize, require('./order/order.router'));
  app.use(`/${tag}/carts`, authorize, require('./cart/cart.router'));
  app.use(`/${tag}/categories`, authorize, require('./category/category.router'));
};
