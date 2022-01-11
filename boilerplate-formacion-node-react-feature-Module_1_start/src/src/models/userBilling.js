const { Sequelize, Model } = require('sequelize');

class UserBilling extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        nif: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        address: {
          type: DataTypes.STRING,
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
        modelName: 'UserBilling',
      },
    );
  }
}

module.exports = UserBilling;
