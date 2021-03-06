'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Symptome extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Symptome.belongsTo(models.Periode, {
        onDelete: 'cascade',
      });
    }
  }
  Symptome.init({
    title: DataTypes.STRING,
    name: DataTypes.TEXT,
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    periodeId: {
      type: DataTypes.INTEGER,
      field: 'periodeId',
    }
  }, {
    sequelize,
    modelName: 'Symptome',
  });

  return Symptome;
};