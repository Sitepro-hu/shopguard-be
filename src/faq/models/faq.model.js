const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");
const FaqCategory = require("./faq-category.model");

const FAQ = sequelize.define("FAQ", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(["PUBLISHED", "DRAFT", "DELETED"]),
    defaultValue: "DRAFT",
  },
  faqCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: FaqCategory,
      key: "id",
    },
  },
});

module.exports = FAQ;
