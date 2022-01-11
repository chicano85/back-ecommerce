module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    await queryInterface.addColumn('products', 'category_uuid', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'category_uuid');
  },
};
