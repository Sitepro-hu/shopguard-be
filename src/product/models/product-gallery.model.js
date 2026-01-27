const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const Product = require("./product.model");

const ProductGallery = sequelize.define("ProductGallery", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  imgSrc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoSrc: {
    type: DataTypes.STRING,
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

module.exports = ProductGallery;
