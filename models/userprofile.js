"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Userprofile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Userprofile.init(
    {
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      photo_url: DataTypes.TEXT,
      role: {
        type: DataTypes.STRING,
      },
      limit: {
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      nibss_roles: {
        type: DataTypes.STRING,
      },
      designation: {
        type: DataTypes.STRING,
      },
      signature_url: {
        type: DataTypes.TEXT,
      },
      department: {
        type: DataTypes.STRING,
      },
      manager: {
        type: DataTypes.STRING,
      },

      isadmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      delegate_role: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Userprofile",
    }
  );
  return Userprofile;
};
