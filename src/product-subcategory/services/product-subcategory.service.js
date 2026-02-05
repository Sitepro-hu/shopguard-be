const ProductSubcategory = require("../models/product-subcategory.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const ProductCategoryGroup = require("../../product-category-group/models/product-category-group.model");
const Product = require("../../product/models/product.model");
const ProductGallery = require("../../product/models/product-gallery.model");
const ProductDownloadable = require("../../product/models/product-downloadable.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  ProductSubcategoryErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class ProductSubcategoryService {
  async createProductSubcategory(productSubcategoryData) {
    const productSubcategory = await ProductSubcategory.create(
      productSubcategoryData
    );
    return await this.getProductSubcategoryById(productSubcategory.id);
  }

  async getAllProductSubcategories() {
    return await ProductSubcategory.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ProductCategory,
          as: "category",
          required: false,
          include: [
            {
              model: ProductCategoryGroup,
              as: "group",
              required: false,
            },
          ],
        },
      ],
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
          include: [
            {
              model: ProductCategoryGroup,
              as: "group",
              required: false,
            },
          ],
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

  async updateProductSubcategory(id, productSubcategoryData) {
    const productSubcategory = await ProductSubcategory.findOne({
      where: { id },
    });

    if (!productSubcategory) {
      throw ProductSubcategoryErrors.notFound();
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
    const categoryInclude = [
      {
        model: ProductCategory,
        as: "category",
        required: false,
        include: [
          {
            model: ProductCategoryGroup,
            as: "group",
            required: false,
          },
        ],
      },
    ];

    const result = await queryDatabase({
      model: ProductSubcategory,
      pagination,
      sort,
      search,
      filters,
      include: categoryInclude,
    });

    const orderBy = sort?.column || "createdAt";
    const isDesc = (sort?.direction || "").toUpperCase() === "DESC";

    result.data = await Promise.all(
      result.data.map(async (row) => {
        const plain = row.toJSON ? row.toJSON() : { ...row };
        try {
          const adj = await getAdjacentElements({
            id: row.id,
            model: ProductSubcategory,
            orderBy,
          });
          let { previousElementId, nextElementId } = adj;
          if (isDesc) {
            [previousElementId, nextElementId] = [
              nextElementId,
              previousElementId,
            ];
          }
          return { ...plain, previousElementId, nextElementId };
        } catch {
          return { ...plain, previousElementId: null, nextElementId: null };
        }
      })
    );

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
