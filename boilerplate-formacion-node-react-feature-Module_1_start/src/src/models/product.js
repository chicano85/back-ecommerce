const { Sequelize, Model } = require('sequelize');

//const Category = require('./category');

class Product extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        category_uuid: {
          type: DataTypes.STRING,
          references: {
            model: {
              tableName: 'categories',
            },
            key: 'uuid',
          },
          defaultValue: null,
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
        modelName: 'Product',
        defaultScope: {
          attributes: {
            include: ['uuid', 'name', 'price'],
          },
        },
      },
    );
  }

  static associate(models) {
    this.productCart = this.belongsToMany(models.Cart, {
      through: models.ProductCart,
      //foreignKey: 'cart_uuid',
    });
    this.category = this.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_uuid',
    });
  }
  toJSON() {
    return { ...this.get() };
  }
}

module.exports = Product;
