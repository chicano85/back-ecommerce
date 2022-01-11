const { Sequelize, Model } = require('sequelize');

class OrderProduct extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        productName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        productPrice: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        productUuid: {
          type: DataTypes.STRING,
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
        modelName: 'OrderProduct',
      },
    );
  }
  static associate(models) {
    this.order = this.belongsTo(models.Order, { as: 'order', foreignKey: 'order_uuid' });
  }
}
module.exports = OrderProduct;
