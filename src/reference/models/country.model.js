const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");

const Country = sequelize.define("Country", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING(2),
    allowNull: false,
    unique: true,
  },
});

module.exports = Country;
