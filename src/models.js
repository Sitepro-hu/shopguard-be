const File = require("./file/models/file.model");
const PasswordResetRequest = require("./user/models/password-reset-request.model");
const User = require("./user/models/user.model");
const Contact = require("./contact/models/contact.model");
const FAQ = require("./faq/models/faq.model");
const Testimonial = require("./testimonial/models/testimonial.model");
const FaqCategory = require("./faq/models/faq-category.model");
const HeroSlider = require("./hero-slider/models/hero-slider.model");
const ProductCategoryGroup = require("./product-category-group/models/product-category-group.model");
const ProductCategory = require("./product-category/models/product-category.model");
const ProductSubcategory = require("./product-subcategory/models/product-subcategory.model");
const Product = require("./product/models/product.model");
const ProductGallery = require("./product/models/product-gallery.model");
const ProductDownloadable = require("./product/models/product-downloadable.model");
const Reference = require("./reference/models/reference.model");
const ReferenceResult = require("./reference/models/reference-result.model");
const ReferenceTestimonial = require("./reference/models/reference-testimonial.model");
const Media = require("./media/models/media.model");
const Partner = require("./partner/models/partner.model");
const DownloadableItem = require("./downloadable-item/models/downloadable-item.model");
const DownloadableCategory = require("./downloadable-item/models/downloadable-category.model");
const InternationalContact = require("./international-contact/models/international-contact.model");
const Glossary = require("./glossary/models/glossary.model");

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

// ProductCategoryGroup - ProductCategory associations
ProductCategory.belongsTo(ProductCategoryGroup, {
  as: "group",
  foreignKey: "productCategoryGroupId",
  onDelete: "CASCADE",
});
ProductCategoryGroup.hasMany(ProductCategory, {
  foreignKey: "productCategoryGroupId",
  as: "categories",
  onDelete: "CASCADE",
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

// Product - ProductCategoryGroup (direct) associations
Product.belongsTo(ProductCategoryGroup, {
  as: "directGroup",
  foreignKey: "productCategoryGroupId",
  onDelete: "CASCADE",
});
ProductCategoryGroup.hasMany(Product, {
  foreignKey: "productCategoryGroupId",
  as: "directProducts",
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

// Reference - ReferenceResult associations
ReferenceResult.belongsTo(Reference, {
  as: "reference",
  foreignKey: "referenceId",
  onDelete: "CASCADE",
});
Reference.hasMany(ReferenceResult, {
  foreignKey: "referenceId",
  as: "results",
  onDelete: "CASCADE",
});

// Reference - ReferenceTestimonial associations
ReferenceTestimonial.belongsTo(Reference, {
  as: "reference",
  foreignKey: "referenceId",
  onDelete: "CASCADE",
});
Reference.hasMany(ReferenceTestimonial, {
  foreignKey: "referenceId",
  as: "testimonials",
  onDelete: "CASCADE",
});

// Product - Reference associations (many-to-many)
Product.belongsToMany(Reference, {
  through: "ProductReferences",
  as: "references",
  foreignKey: "productId",
  otherKey: "referenceId",
});
Reference.belongsToMany(Product, {
  through: "ProductReferences",
  as: "products",
  foreignKey: "referenceId",
  otherKey: "productId",
});

// Product - Media associations (many-to-many)
Product.belongsToMany(Media, {
  through: "ProductMedia",
  as: "media",
  foreignKey: "productId",
  otherKey: "mediaId",
});
Media.belongsToMany(Product, {
  through: "ProductMedia",
  as: "products",
  foreignKey: "mediaId",
  otherKey: "productId",
});

// Reference - Media associations (many-to-many)
Reference.belongsToMany(Media, {
  through: "ReferenceMedia",
  as: "media",
  foreignKey: "referenceId",
  otherKey: "mediaId",
});
Media.belongsToMany(Reference, {
  through: "ReferenceMedia",
  as: "references",
  foreignKey: "mediaId",
  otherKey: "referenceId",
});

// Media - Media self-referential associations (related media)
Media.belongsToMany(Media, {
  through: "RelatedMedia",
  as: "relatedMedia",
  foreignKey: "mediaId",
  otherKey: "relatedMediaId",
});

// Reference - Reference self-referential associations (related references)
Reference.belongsToMany(Reference, {
  through: "RelatedReferences",
  as: "relatedReferences",
  foreignKey: "referenceId",
  otherKey: "relatedReferenceId",
});

// Partner model (no associations needed)

// DownloadableCategory - DownloadableItem associations
DownloadableItem.belongsTo(DownloadableCategory, {
  as: "category",
  foreignKey: "downloadableCategoryId",
  onDelete: "SET NULL",
});
DownloadableCategory.hasMany(DownloadableItem, {
  foreignKey: "downloadableCategoryId",
  as: "items",
  onDelete: "SET NULL",
});

// InternationalContact model (no associations needed)

module.exports = {
  User,
  PasswordResetRequest,
  File,
  Contact,
  FAQ,
  Testimonial,
  FaqCategory,
  HeroSlider,
  ProductCategoryGroup,
  ProductCategory,
  ProductSubcategory,
  Product,
  ProductGallery,
  ProductDownloadable,
  Reference,
  ReferenceResult,
  ReferenceTestimonial,
  Media,
  Partner,
  DownloadableItem,
  DownloadableCategory,
  InternationalContact,
  Glossary,
};
