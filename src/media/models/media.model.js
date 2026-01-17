const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");

const Media = sequelize.define("Media", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  longDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imgSrc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoSrc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(["PUBLISHED", "DRAFT", "DELETED"]),
    defaultValue: "DRAFT",
  },
});

module.exports = Media;
