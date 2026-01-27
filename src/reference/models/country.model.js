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
  },
  code: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },
}, {
  indexes: [], // Ne hozzon létre automatikus indexeket, csak primary key és foreign key indexek
});

module.exports = Country;
