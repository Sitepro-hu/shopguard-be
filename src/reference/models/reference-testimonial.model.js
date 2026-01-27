const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const Reference = require("./reference.model");

const ReferenceTestimonial = sequelize.define("ReferenceTestimonial", {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  },
}, {
  indexes: [], // Ne hozzon létre automatikus indexeket, csak primary key és foreign key indexek
});

module.exports = ReferenceTestimonial;
