const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const ProductSubcategory = require("../../product-subcategory/models/product-subcategory.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const ProductCategoryGroup = require("../../product-category-group/models/product-category-group.model");

const ProductLink = sequelize.define("ProductLink", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  redirectUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productSubcategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ProductSubcategory,
      key: "id",
    },
  },
  productCategoryGroupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ProductCategoryGroup,
      key: "id",
    },
  },
  isDirectToGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  productCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ProductCategory,
      key: "id",
    },
  },
  isDirectToCategory: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
}, {
  indexes: [],
});

module.exports = ProductLink;
