const File = require("./file/models/file.model");
const PasswordResetRequest = require("./user/models/password-reset-request.model");
const User = require("./user/models/user.model");
const Contact = require("./contact/models/contact.model");
const FAQ = require("./faq/models/faq.model");
const Testimonial = require("./testimonial/models/testimonial.model");
const FaqCategory = require("./faq/models/faq-category.model");
const HeroSlider = require("./hero-slider/models/hero-slider.model");
const ProductCategory = require("./product-category/models/product-category.model");
const ProductSubcategory = require("./product-subcategory/models/product-subcategory.model");
const Product = require("./product/models/product.model");
const ProductGallery = require("./product/models/product-gallery.model");
const ProductDownloadable = require("./product/models/product-downloadable.model");

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

// ProductCategory - ProductSubcategory associations
ProductSubcategory.belongsTo(ProductCategory, {
  as: "category",
  foreignKey: "productCategoryId",
  onDelete: "CASCADE",
});
ProductCategory.hasMany(ProductSubcategory, {
  foreignKey: "productCategoryId",
  as: "subcategories",
  onDelete: "CASCADE",
});

// ProductSubcategory - Product associations
Product.belongsTo(ProductSubcategory, {
  as: "subcategory",
  foreignKey: "productSubcategoryId",
  onDelete: "CASCADE",
});
ProductSubcategory.hasMany(Product, {
  foreignKey: "productSubcategoryId",
  as: "products",
  onDelete: "CASCADE",
});

// Product - ProductGallery associations
ProductGallery.belongsTo(Product, {
  as: "product",
  foreignKey: "productId",
  onDelete: "CASCADE",
});
Product.hasMany(ProductGallery, {
  foreignKey: "productId",
  as: "gallery",
  onDelete: "CASCADE",
});

// Product - ProductDownloadable associations
ProductDownloadable.belongsTo(Product, {
  as: "product",
  foreignKey: "productId",
  onDelete: "CASCADE",
});
Product.hasMany(ProductDownloadable, {
  foreignKey: "productId",
  as: "downloadables",
  onDelete: "CASCADE",
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
  ProductCategory,
  ProductSubcategory,
  Product,
  ProductGallery,
  ProductDownloadable,
};
