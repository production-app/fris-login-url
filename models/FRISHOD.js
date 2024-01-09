const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "FRISHOD",
    {
      "s/n": {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
      },
      fullnames: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      grade: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      designate: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      department_role: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "FRISHOD",
      schema: "public",
      timestamps: false,
    }
  );
};
