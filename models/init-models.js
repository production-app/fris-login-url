var DataTypes = require("sequelize").DataTypes;
var _FRISHOD = require("./FRISHOD");

function initModels(sequelize) {
  var FRISHOD = _FRISHOD(sequelize, DataTypes);


  return {
    FRISHOD,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
