'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class googleUrl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({mailLog}) {
      this.belongsTo(mailLog, { foreignKey: 'ticket_id'})
    }
  }
  googleUrl.init({
    url_link: DataTypes.ARRAY(DataTypes.STRING),
    ticket_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'googleUrl',
  });
  return googleUrl;
};