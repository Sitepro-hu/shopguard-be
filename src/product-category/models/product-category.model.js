const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const ProductCategoryGroup = require("../../product-category-group/models/product-category-group.model");

const ProductCategory = sequelize.define("ProductCategory", {
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
  description: {
    type: DataTypes.TEXT,
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
  productCategoryGroupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductCategoryGroup,
      key: "id",
    },
  },
}, {
  indexes: [], // Ne hozzon létre automatikus indexeket, csak primary key és foreign key indexek
});

module.exports = ProductCategory;
