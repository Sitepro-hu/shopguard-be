const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");

const HeroSlider = sequelize.define("HeroSlider", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imgSrc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoSrc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  btnText: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  btnLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  },
  bgColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "#03070D",
  },
  status: {
    type: DataTypes.ENUM(["PUBLISHED", "DRAFT", "DELETED"]),
    defaultValue: "DRAFT",
  },
});

module.exports = HeroSlider;
