'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class azureUrl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({mailLog, requestTypes}) {
      // define association here
      this.belongsTo(mailLog, { foreignKey: 'ticket_id'})
      this.belongsTo(requestTypes, { foreignKey: 'ticket_id'})
    }

    
    toJSON() {
      return { ...this.get(), ticket_id:undefined, id:undefined }
    }
  }
  azureUrl.init({
    image_url: DataTypes.STRING,
    ticket_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'azureUrl',
  });
  return azureUrl;
};