const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const Reference = require("./reference.model");

const ReferenceResult = sequelize.define("ReferenceResult", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Reference,
      key: "id",
    },
  },
  resultScore: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  },
}, {
  indexes: [], // Ne hozzon létre automatikus indexeket, csak primary key és foreign key indexek
});

module.exports = ReferenceResult;
