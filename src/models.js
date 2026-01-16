const File = require("./file/models/file.model");
const PasswordResetRequest = require("./user/models/password-reset-request.model");
const User = require("./user/models/user.model");
const Contact = require("./contact/models/contact.model");
const FAQ = require("./faq/models/faq.model");
const Testimonial = require("./testimonial/models/testimonial.model");
const FaqCategory = require("./faq/models/faq-category.model");
const HeroSlider = require("./hero-slider/models/hero-slider.model");

User.hasMany(PasswordResetRequest, {
  foreignKey: "userId",
  as: "passwordResetRequests",
  onDelete: "CASCADE",
});
PasswordResetRequest.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

// Faq - FaqCategory associations
FAQ.belongsTo(FaqCategory, {
  as: "category",
  foreignKey: "faqCategoryId",
  onDelete: "SET NULL",
});
FaqCategory.hasMany(FAQ, {
  foreignKey: "faqCategoryId",
  as: "faqs",
  onDelete: "SET NULL",
});

module.exports = {
  User,
  PasswordResetRequest,
  File,
  Contact,
  FAQ,
  Testimonial,
  FaqCategory,
  HeroSlider,
};
