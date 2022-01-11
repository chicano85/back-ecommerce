module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    await queryInterface.addColumn('users', 'billing_uuid', {
      type: DataTypes.STRING,
      references: {
        model: {
          tableName: 'user_billings',
        },
        key: 'uuid',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'billing_uuid');
  },
};
