const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");

const Contact = sequelize.define("Contact", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: DataTypes.STRING,
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: DataTypes.TEXT,
  privacyPolicy: DataTypes.BOOLEAN,
  status: DataTypes.ENUM(["UNREAD", "READ", "DELETED"]),
}, {
  indexes: [], // Ne hozzon létre automatikus indexeket, csak primary key és foreign key indexek
});

module.exports = Contact;
