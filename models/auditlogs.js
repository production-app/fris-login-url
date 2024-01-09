'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class auditLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  auditLogs.init({
    user: DataTypes.STRING,
    user_email: DataTypes.STRING,
    session: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'auditLogs',
  });
  return auditLogs;
};