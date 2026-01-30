const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const ProductCategory = require("../../product-category/models/product-category.model");

const ProductSubcategory = sequelize.define("ProductSubcategory", {
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
  },
  imgSrc: {
    type: DataTypes.STRING,
    allowNull: true,
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
  productCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductCategory,
      key: "id",
    },
  },
}, {
  indexes: [], // Ne hozzon létre automatikus indexeket, csak primary key és foreign key indexek
});

module.exports = ProductSubcategory;
