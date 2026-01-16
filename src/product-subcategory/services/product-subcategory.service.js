const ProductSubcategory = require("../models/product-subcategory.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const Product = require("../../product/models/product.model");
const ProductGallery = require("../../product/models/product-gallery.model");
const ProductDownloadable = require("../../product/models/product-downloadable.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  ProductSubcategoryErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const {
  customSlugify,
} = require("../../shared/database-helpers/slugify-helper");

class ProductSubcategoryService {
  async createProductSubcategory(productSubcategoryData) {
    // Ha nincs slug vagy üres, generáljuk a title-ből
    if (
      !productSubcategoryData.slug ||
      productSubcategoryData.slug.trim() === ""
    ) {
      productSubcategoryData.slug = await customSlugify(
        ProductSubcategory,
        productSubcategoryData.title,
        null
      );
    }
    const productSubcategory = await ProductSubcategory.create(
      productSubcategoryData
    );
    return await this.getProductSubcategoryById(productSubcategory.id);
  }

  async getAllProductSubcategories() {
    return await ProductSubcategory.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getProductSubcategoryById(id, includeAdjacent = false) {
    const productSubcategory = await ProductSubcategory.findOne({
      where: { id },
      include: [
        {
          model: ProductCategory,
          as: "category",
          required: false,
        },
      ],
    });

    if (!productSubcategory) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: ProductSubcategory,
          orderBy: "createdAt",
        });

        return {
          ...productSubcategory.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a productSubcategory-t adjuk vissza
        return productSubcategory;
      }
    }

    return productSubcategory;
  }

  async getProductSubcategoryBySlug(slug) {
    const productSubcategory = await ProductSubcategory.findOne({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: [
        {
          model: ProductCategory,
          as: "category",
          required: false,
        },
        {
          model: Product,
          as: "products",
          required: false,
          where: { status: "PUBLISHED" },
          order: [["displayOrder", "ASC"]],
          include: [
            {
              model: ProductGallery,
              as: "gallery",
              required: false,
              order: [["displayOrder", "ASC"]],
            },
            {
              model: ProductDownloadable,
              as: "downloadables",
              required: false,
              order: [["displayOrder", "ASC"]],
            },
          ],
        },
      ],
    });

    return productSubcategory;
  }

  async updateProductSubcategory(id, productSubcategoryData) {
    const productSubcategory = await ProductSubcategory.findOne({
      where: { id },
    });

    if (!productSubcategory) {
      throw ProductSubcategoryErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    if (
      (!productSubcategoryData.slug ||
        productSubcategoryData.slug.trim() === "") &&
      productSubcategoryData.title
    ) {
      productSubcategoryData.slug = await customSlugify(
        ProductSubcategory,
        productSubcategoryData.title,
        id
      );
    }

    await productSubcategory.update(productSubcategoryData);

    return await this.getProductSubcategoryById(id);
  }

  async deleteProductSubcategory(id) {
    const productSubcategory = await ProductSubcategory.findOne({
      where: { id },
    });

    if (!productSubcategory) {
      throw ProductSubcategoryErrors.notFound();
    }

    await productSubcategory.destroy();

    return true;
  }

  async queryProductSubcategories({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: ProductSubcategory,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateProductSubcategoryStatus(ids, status) {
    await ProductSubcategory.update({ status }, { where: { id: ids } });

    const updatedProductSubcategories = await ProductSubcategory.findAll({
      where: {
        id: ids,
      },
    });

    return updatedProductSubcategories;
  }
}

module.exports = new ProductSubcategoryService();
