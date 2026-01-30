const { DataTypes } = require("sequelize");
const sequelize = require("../../shared/database-helpers/database");

const SOCIAL_MEDIA_TYPES = [
  "FACEBOOK",
  "INSTAGRAM",
  "TWITTER_X",
  "LINKEDIN",
  "YOUTUBE",
  "TIKTOK",
  "PINTEREST",
  "WHATSAPP",
  "TELEGRAM",
  "OTHER",
];

const SocialMediaPage = sequelize.define("SocialMediaPage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(SOCIAL_MEDIA_TYPES),
    allowNull: false,
  },
  url: {
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
}, {
  indexes: [],
});

SocialMediaPage.SOCIAL_MEDIA_TYPES = SOCIAL_MEDIA_TYPES;
module.exports = SocialMediaPage;
