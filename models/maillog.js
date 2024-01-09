'use strict';
const {
  Model
} = require('sequelize');
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  class mailLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({azureUrl, requestTypes}) {
      // define association here

      this.hasMany(azureUrl, { foreignKey: 'ticket_id'})
      this.hasMany(requestTypes, { foreignKey: 'ticket_id'})
    }

    toJSON() {
      return { ...this.get(), id:undefined, isOpen:undefined, isShown: undefined }
    }
  }
  mailLog.init({
    sender_email: DataTypes.STRING,
    body: DataTypes.TEXT,
    ticket_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    subject: DataTypes.STRING,
    isOpen: DataTypes.BOOLEAN,
    isShown: DataTypes.BOOLEAN,
    sender_name: DataTypes.STRING,
    assignees: DataTypes.STRING,
    assignees_email: DataTypes.STRING,
    attachment: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.ENUM('OPENED', 'PENDING', 'IN-PROGRESS', 'COMPLETED'), 
      defaultValue: 'OPENED'
    },
    received_date: {
      type: DataTypes.DATE,
      get() {
        const date = this.getDataValue("received_date");
        return moment(date).format("LL");
      },
    },
    uuid:{
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    sequelize,
    modelName: 'mailLog',
  });
  return mailLog;
};