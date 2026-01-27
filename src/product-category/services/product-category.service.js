const ProductCategory = require("../models/product-category.model");
const ProductCategoryGroup = require("../../product-category-group/models/product-category-group.model");
const ProductSubcategory = require("../../product-subcategory/models/product-subcategory.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  ProductCategoryErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const { customSlugify } = require("../../shared/database-helpers/slugify-helper");

class ProductCategoryService {
  async createProductCategory(productCategoryData) {
    // Ha nincs slug vagy üres, generáljuk a title-ből
    if (!productCategoryData.slug || productCategoryData.slug.trim() === "") {
      productCategoryData.slug = await customSlugify(
        ProductCategory,
        productCategoryData.title,
        null
      );
    }
    const productCategory = await ProductCategory.create(productCategoryData);
    return await this.getProductCategoryById(productCategory.id);
  }

  async getAllProductCategories() {
    return await ProductCategory.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedProductCategories() {
    return await ProductCategory.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
      include: [
        {
          model: ProductCategoryGroup,
          as: "group",
          required: false,
          where: { status: "PUBLISHED" },
        },
        {
          model: ProductSubcategory,
          as: "subcategories",
          required: false,
          where: { status: "PUBLISHED" },
          order: [["displayOrder", "ASC"]],
        },
      ],
    });
  }

  async getProductCategoryById(id, includeAdjacent = false) {
    const productCategory = await ProductCategory.findOne({ 
      where: { id },
      include: [
        {
          model: ProductCategoryGroup,
          as: "group",
          required: false,
        },
        {
          model: ProductSubcategory,
          as: "subcategories",
          required: false,
        },
      ],
    });

    if (!productCategory) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: ProductCategory,
          orderBy: "createdAt"
        });

        return {
          ...productCategory.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a productCategory-t adjuk vissza
        return productCategory;
      }
    }

    return productCategory;
  }

  async updateProductCategory(id, productCategoryData) {
    const productCategory = await ProductCategory.findOne({
      where: { id },
    });

    if (!productCategory) {
      throw ProductCategoryErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    if (
      (!productCategoryData.slug || productCategoryData.slug.trim() === "") &&
      productCategoryData.title
    ) {
      productCategoryData.slug = await customSlugify(
        ProductCategory,
        productCategoryData.title,
        id
      );
    }

    await productCategory.update(productCategoryData);

    return await this.getProductCategoryById(id);
  }

  async deleteProductCategory(id) {
    const productCategory = await ProductCategory.findOne({
      where: { id },
    });

    if (!productCategory) {
      throw ProductCategoryErrors.notFound();
    }

    await productCategory.destroy();

    return true;
  }

  async queryProductCategories({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: ProductCategory,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateProductCategoryStatus(ids, status) {
    await ProductCategory.update({ status }, { where: { id: ids } });

    const updatedProductCategories = await ProductCategory.findAll({
      where: {
        id: ids,
      },
    });

    return updatedProductCategories;
  }
}

module.exports = new ProductCategoryService();
