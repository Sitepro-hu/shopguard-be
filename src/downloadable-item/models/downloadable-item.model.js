const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const DownloadableCategory = require("./downloadable-category.model");

const DownloadableItem = sequelize.define("DownloadableItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
  },
  status: {
    type: DataTypes.ENUM(["PUBLISHED", "DRAFT", "DELETED"]),
    defaultValue: "DRAFT",
  },
  downloadableCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: DownloadableCategory,
      key: "id",
    },
  },
});

module.exports = DownloadableItem;
