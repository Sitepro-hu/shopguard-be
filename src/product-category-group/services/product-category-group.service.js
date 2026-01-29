const ProductCategoryGroup = require("../models/product-category-group.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const ProductSubcategory = require("../../product-subcategory/models/product-subcategory.model");
const Product = require("../../product/models/product.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  ProductCategoryGroupErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const { customSlugify } = require("../../shared/database-helpers/slugify-helper");

class ProductCategoryGroupService {
  async createProductCategoryGroup(productCategoryGroupData) {
    // Ha nincs slug vagy üres, generáljuk a title-ből
    if (!productCategoryGroupData.slug || productCategoryGroupData.slug.trim() === "") {
      productCategoryGroupData.slug = await customSlugify(
        ProductCategoryGroup,
        productCategoryGroupData.title,
        null
      );
    }
    const productCategoryGroup = await ProductCategoryGroup.create(productCategoryGroupData);
    return await this.getProductCategoryGroupById(productCategoryGroup.id);
  }

  async getAllProductCategoryGroups() {
    return await ProductCategoryGroup.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedProductCategoryGroups() {
    return await ProductCategoryGroup.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
      include: [
        {
          model: ProductCategory,
          as: "categories",
          required: false,
          where: { status: "PUBLISHED" },
          order: [["displayOrder", "ASC"]],
          include: [
            {
              model: ProductSubcategory,
              as: "subcategories",
              required: false,
              where: { status: "PUBLISHED" },
              order: [["displayOrder", "ASC"]],
            },
            {
              model: Product,
              as: "directProducts",
              required: false,
              where: { status: "PUBLISHED", isDirectToCategory: true },
              order: [["displayOrder", "ASC"]],
            },
          ],
        },
        {
          model: Product,
          as: "directProducts",
          required: false,
          where: { status: "PUBLISHED", isDirectToGroup: true },
          order: [["displayOrder", "ASC"]],
        },
      ],
    });
  }

  async getProductCategoryGroupById(id, includeAdjacent = false) {
    const productCategoryGroup = await ProductCategoryGroup.findOne({ 
      where: { id },
      include: [
        {
          model: ProductCategory,
          as: "categories",
          required: false,
          include: [
            {
              model: ProductSubcategory,
              as: "subcategories",
              required: false,
            },
          ],
        },
      ],
    });

    if (!productCategoryGroup) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: ProductCategoryGroup,
          orderBy: "createdAt"
        });

        return {
          ...productCategoryGroup.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a productCategoryGroup-t adjuk vissza
        return productCategoryGroup;
      }
    }

    return productCategoryGroup;
  }

  async updateProductCategoryGroup(id, productCategoryGroupData) {
    const productCategoryGroup = await ProductCategoryGroup.findOne({
      where: { id },
    });

    if (!productCategoryGroup) {
      throw ProductCategoryGroupErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    if (
      (!productCategoryGroupData.slug || productCategoryGroupData.slug.trim() === "") &&
      productCategoryGroupData.title
    ) {
      productCategoryGroupData.slug = await customSlugify(
        ProductCategoryGroup,
        productCategoryGroupData.title,
        id
      );
    }

    await productCategoryGroup.update(productCategoryGroupData);

    return await this.getProductCategoryGroupById(id);
  }

  async deleteProductCategoryGroup(id) {
    const productCategoryGroup = await ProductCategoryGroup.findOne({
      where: { id },
    });

    if (!productCategoryGroup) {
      throw ProductCategoryGroupErrors.notFound();
    }

    await productCategoryGroup.destroy();

    return true;
  }

  async queryProductCategoryGroups({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: ProductCategoryGroup,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateProductCategoryGroupStatus(ids, status) {
    await ProductCategoryGroup.update({ status }, { where: { id: ids } });

    const updatedProductCategoryGroups = await ProductCategoryGroup.findAll({
      where: {
        id: ids,
      },
    });

    return updatedProductCategoryGroups;
  }
}

module.exports = new ProductCategoryGroupService();
