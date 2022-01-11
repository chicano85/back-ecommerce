const { Sequelize, Model, DataTypes } = require('sequelize');

//const Product = require('./product');

class ProductCart extends Model {
  static init(sequelize) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        product_uuid: {
          type: DataTypes.STRING,
          field: 'product_uuid',
          references: {
            model: {
              tableName: 'products',
            },
            key: 'uuid',
          },
          allowNull: true,
        },
        cart_uuid: {
          type: DataTypes.STRING,
          field: 'cart_uuid',
          references: {
            model: {
              tableName: 'carts',
            },
            key: 'uuid',
          },
          allowNull: true,
        },
        deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'ProductCart',
      },
    );
  }

  static associate(models) {
    this.product = models.Cart.belongsToMany(models.Product, {
      through: this,
      foreignKey: {
        name: 'ProductUuid',
        field: 'product_uuid',
        defaultValue: null,
        type: DataTypes.STRING,
      },
    });
    this.cart = models.Product.belongsToMany(models.Cart, {
      through: this,
      foreignKey: {
        name: 'CartUuid',
        field: 'cart_uuid',
        defaultValue: null,
        type: DataTypes.STRING,
      },
    });
  }
  toJSON() {
    return { ...this.get() };
  }
}

module.exports = ProductCart;
