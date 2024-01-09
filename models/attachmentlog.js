'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attachmentLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({mailLog}) {
      // define association here
      this.belongsTo(mailLog, { foreignKey: 'ticket_id'})
    }

    toJSON() {
      return { ...this.get(), id:undefined }
    }
  }
  attachmentLog.init({
    google_id: DataTypes.STRING,
    uuid:{
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4
    },
    ticket_id:{
     type: DataTypes.INTEGER,
    } 
  }, {
    sequelize,
    modelName: 'attachmentLog',
  });
  return attachmentLog;
};