const { Sequelize, Model } = require('sequelize');
const OrderProduct = require('./orderProduct');

class Order extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cancel_reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0, // En espera
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
        modelName: 'Order',
        tableName: 'orders',
        defaultScope: {
          include: [
            { model: OrderProduct, as: 'orderProducts', required: true },
            // {model : User, as: 'user', required: true },
          ],
        },
      },
    );
  }

  static associate(models) {
    this.user = this.belongsTo(models.User, { as: 'user', foreignKey: 'user_uuid' });
    this.orderProducts = this.hasMany(models.OrderProduct, {
      as: 'orderProducts',
    });
  }
  toJSON() {
    return { ...this.get() };
  }
}

module.exports = Order;
