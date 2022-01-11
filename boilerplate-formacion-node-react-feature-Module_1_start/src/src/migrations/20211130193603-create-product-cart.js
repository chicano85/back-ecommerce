module.exports = {
  up: async (queryInterface, { DataTypes, UUIDV4 }) => {
    await queryInterface.createTable('product_carts', {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_uuid: {
        type: DataTypes.STRING,
        references: {
          model: {
            tableName: 'products',
          },
          key: 'uuid',
          as: 'product_uuid',
        },
        allowNull: false,
      },
      cart_uuid: {
        type: DataTypes.STRING,
        references: {
          model: {
            tableName: 'carts',
          },
          key: 'uuid',
          as: 'cart_uuid',
        },
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('product_carts');
  },
};
