const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { UserGroup } = require('../models');

module.exports = {
  up: async (queryInterface) => {
    try {
      await queryInterface.bulkInsert('user_groups', [
        {
          uuid: uuid.v4(),
          name: 'Usuario',
          permissions: 'USER',
        },
      ]);

      let UserGroups = await UserGroup.findAll({ where: { name: 'Usuario' } });

      if (UserGroups.length > 0) {
        UserGroups = UserGroups.pop();
      }

      const password = bcrypt.hashSync('123456', bcrypt.genSaltSync(10));

      await queryInterface.bulkInsert('users', [
        {
          uuid: uuid.v4(),
          name: 'Angela',
          email: 'angela@agilia.com',
          password,
          role_uuid: UserGroups.uuid,
          token: '',
          active: true,
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_groups', null, {});
  },
};
