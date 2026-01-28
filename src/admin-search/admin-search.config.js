const { Op } = require("sequelize");

const User = require("../user/models/user.model");
const Contact = require("../contact/models/contact.model");
const Product = require("../product/models/product.model");
const ProductCategoryGroup = require("../product-category-group/models/product-category-group.model");
const ProductCategory = require("../product-category/models/product-category.model");
const ProductSubcategory = require("../product-subcategory/models/product-subcategory.model");
const HeroSlider = require("../hero-slider/models/hero-slider.model");
const Partner = require("../partner/models/partner.model");
const Media = require("../media/models/media.model");
const Reference = require("../reference/models/reference.model");
const Glossary = require("../glossary/models/glossary.model");
const FAQ = require("../faq/models/faq.model");
const FaqCategory = require("../faq/models/faq-category.model");
const DownloadableItem = require("../downloadable-item/models/downloadable-item.model");
const DownloadableCategory = require("../downloadable-item/models/downloadable-category.model");
const InternationalContact = require("../international-contact/models/international-contact.model");

/**
 * Konfiguráció: mely modellekben, mely mezőkben keresünk.
 * Itt könnyen bővíthető a keresés a jövőben.
 */
const adminSearchConfig = [
  // User
  {
    model: User,
    type: "user",
    titleField: "email",
    searchFields: ["email", "firstname", "lastname"],
    extraFields: ["firstname", "lastname"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Contact
  {
    model: Contact,
    type: "contact",
    titleField: "name",
    searchFields: ["name", "email", "telephone", "message"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Hero slider
  {
    model: HeroSlider,
    type: "heroSlider",
    titleField: "title",
    searchFields: ["title", "description", "btnText", "btnLink"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Partner
  {
    model: Partner,
    type: "partner",
    titleField: "name",
    searchFields: ["name"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Product
  {
    model: Product,
    type: "product",
    titleField: "title",
    searchFields: ["title", "shortDescription", "longDescription"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  {
    model: ProductCategory,
    type: "productCategory",
    titleField: "title",
    searchFields: ["title", "description"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Product category group
  {
    model: ProductCategoryGroup,
    type: "productCategoryGroup",
    titleField: "title",
    searchFields: ["title", "description"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Product subcategory
  {
    model: ProductSubcategory,
    type: "productSubcategory",
    titleField: "title",
    searchFields: ["title", "description"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  {
    model: Media,
    type: "media",
    titleField: "title",
    searchFields: ["title", "shortDescription", "longDescription"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Reference
  {
    model: Reference,
    type: "reference",
    titleField: "title",
    searchFields: [
      "title",
      "shortDescription",
      "introDescription",
      "longDescription",
      "companyName",
    ],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // FAQ
  {
    model: FAQ,
    type: "faq",
    titleField: "question",
    searchFields: ["question", "answer"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // FAQ category
  {
    model: FaqCategory,
    type: "faqCategory",
    titleField: "title",
    searchFields: ["title"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Downloadable item
  {
    model: DownloadableItem,
    type: "downloadableItem",
    titleField: "name",
    searchFields: ["name", "link"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Downloadable category
  {
    model: DownloadableCategory,
    type: "downloadableCategory",
    titleField: "name",
    searchFields: ["name"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // Glossary
  {
    model: Glossary,
    type: "glossary",
    titleField: "name",
    searchFields: ["name", "description"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
  // International contact
  {
    model: InternationalContact,
    type: "internationalContact",
    titleField: "name",
    searchFields: ["countryName", "name", "email", "telephone"],
    where: { status: { [Op.ne]: "DELETED" } },
  },
];

module.exports = {
  adminSearchConfig,
};

