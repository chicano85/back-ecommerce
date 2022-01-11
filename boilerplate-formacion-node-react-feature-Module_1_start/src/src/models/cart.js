const { Sequelize, Model } = require('sequelize');
const { User, Product, ProductCart } = require('./index');
//const { Product } = require('./product');
//const { ProductCart } = require('./productCart');

class Cart extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0, // En proceso
        },
        user_uuid: {
          type: DataTypes.STRING,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'uuid',
          },
          allowNull: false,
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
        modelName: 'Cart',
        defaultScope: {
          include: [
            //{ model: ProductCart, as: 'productCart', nested: true },
            {
              model: User,
              as: 'user',
              foreignKey: 'user_uuid',
            },
            {
              model: Product,
              through: ProductCart,
              foreignKey: 'ProductUuid',
            },
          ],
        },
        //modelName: 'Cart',
      },
    );
  }

  static associate(models) {
    //this.user = this.belongsTo(models.User, { as: 'user', foreignKey: 'user_uuid' });
    //this.productCart = this.hasMany(models.ProductCart, { as: 'productCart' });
    this.user = this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_uuid',
    });
    this.productCart = this.belongsToMany(models.Product, {
      through: models.ProductCart,
      foreignKey: 'ProductUuid',
    });
  }
  toJSON() {
    return { ...this.get() };
  }
}

module.exports = Cart;
