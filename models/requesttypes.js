'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requestTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({mailLog, azureUrl}) {
      // define association here
      this.belongsTo(mailLog, { foreignKey: 'ticket_id'})
      this.belongsTo(azureUrl, { foreignKey: 'ticket_id' })
    }

    toJSON() {
      return { ...this.get(), ticket_id:undefined, id:undefined }
    }
  }
  requestTypes.init({
    request_id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4
    },
    status:{
      type: DataTypes.ENUM('OPENED', 'PENDING', 'IN-PROGRESS', 'COMPLETED'),
      defaultValue: 'OPENED'
    }, 
    request_types: DataTypes.STRING,
    ticket_id: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'requestTypes',
  });
  return requestTypes;
};