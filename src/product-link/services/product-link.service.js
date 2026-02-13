const ProductLink = require("../models/product-link.model");
const ProductSubcategory = require("../../product-subcategory/models/product-subcategory.model");
const ProductCategory = require("../../product-category/models/product-category.model");
const ProductCategoryGroup = require("../../product-category-group/models/product-category-group.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const { ProductLinkErrors } = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

function normalizeProductLinkPath(fields, isUpdate = false) {
  const isDirectGroup = Boolean(fields.isDirectToGroup);
  const isDirectCategory = Boolean(fields.isDirectToCategory);
  const hasSubcategory = fields.productSubcategoryId != null && fields.productSubcategoryId !== "";
  const hasGroup = fields.productCategoryGroupId != null && fields.productCategoryGroupId !== "";
  const hasCategory = fields.productCategoryId != null && fields.productCategoryId !== "";

  const fail = isUpdate ? ProductLinkErrors.updateFailed : ProductLinkErrors.createFailed;

  if (isDirectGroup && isDirectCategory) {
    throw fail("Use only one of isDirectToGroup or isDirectToCategory");
  }
  if (isDirectGroup) {
    if (!hasGroup) {
      throw fail("Direct-to-group product link requires productCategoryGroupId");
    }
    return {
      ...fields,
      productSubcategoryId: null,
      productCategoryId: null,
      productCategoryGroupId: Number(fields.productCategoryGroupId),
      isDirectToGroup: true,
      isDirectToCategory: false,
    };
  }
  if (isDirectCategory) {
    if (!hasCategory) {
      throw fail("Direct-to-category product link requires productCategoryId");
    }
    return {
      ...fields,
      productSubcategoryId: null,
      productCategoryGroupId: null,
      productCategoryId: Number(fields.productCategoryId),
      isDirectToGroup: false,
      isDirectToCategory: true,
    };
  }
  if (!hasSubcategory) {
    throw fail(
      "Normal product link requires productSubcategoryId, or set isDirectToGroup with productCategoryGroupId, or isDirectToCategory with productCategoryId"
    );
  }
  return {
    ...fields,
    productSubcategoryId: Number(fields.productSubcategoryId),
    productCategoryGroupId: null,
    productCategoryId: null,
    isDirectToGroup: false,
    isDirectToCategory: false,
  };
}

class ProductLinkService {
  async createProductLink(productLinkData) {
    const normalized = normalizeProductLinkPath(productLinkData);
    const productLink = await ProductLink.create(normalized);
    return await this.getProductLinkById(productLink.id);
  }

  async getAllProductLinks() {
    return await ProductLink.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: ProductSubcategory,
          as: "subcategory",
          required: false,
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
        },
        {
          model: ProductCategoryGroup,
          as: "directGroup",
          required: false,
        },
        {
          model: ProductCategory,
          as: "directCategory",
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

  async getProductLinkById(id, includeAdjacent = false) {
    const productLink = await ProductLink.findOne({
      where: { id },
      include: [
        {
          model: ProductSubcategory,
          as: "subcategory",
          required: false,
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
        },
        {
          model: ProductCategoryGroup,
          as: "directGroup",
          required: false,
        },
        {
          model: ProductCategory,
          as: "directCategory",
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

    if (!productLink) {
      return null;
    }

    const productLinkJson = productLink.toJSON();

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: ProductLink,
          orderBy: "createdAt",
        });

        return {
          ...productLinkJson,
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return productLinkJson;
      }
    }

    return productLinkJson;
  }

  async updateProductLink(id, productLinkData) {
    const productLink = await ProductLink.findOne({
      where: { id },
    });

    if (!productLink) {
      throw ProductLinkErrors.notFound();
    }

    const merged = { ...productLink.get({ plain: true }), ...productLinkData };
    const normalized = normalizeProductLinkPath(merged, true);
    await productLink.update(normalized);

    return await this.getProductLinkById(id);
  }

  async deleteProductLink(id) {
    const productLink = await ProductLink.findOne({
      where: { id },
    });

    if (!productLink) {
      throw ProductLinkErrors.notFound();
    }

    await productLink.destroy();

    return true;
  }

  async queryProductLinks({ pagination, sort, search, filters }) {
    const productLinkInclude = [
      {
        model: ProductSubcategory,
        as: "subcategory",
        required: false,
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
      },
      {
        model: ProductCategoryGroup,
        as: "directGroup",
        required: false,
      },
      {
        model: ProductCategory,
        as: "directCategory",
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
      model: ProductLink,
      pagination,
      sort,
      search,
      filters,
      include: productLinkInclude,
    });

    const orderBy = sort?.column || "createdAt";
    const isDesc = (sort?.direction || "").toUpperCase() === "DESC";

    if (result.data) {
      result.data = await Promise.all(
        result.data.map(async (row) => {
          const plain = row.toJSON ? row.toJSON() : { ...row };
          try {
            const adj = await getAdjacentElements({
              id: row.id,
              model: ProductLink,
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
    }

    return result;
  }

  async updateProductLinkStatus(ids, status) {
    await ProductLink.update({ status }, { where: { id: ids } });

    const updatedProductLinks = await ProductLink.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: ProductSubcategory,
          as: "subcategory",
          required: false,
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
        },
        {
          model: ProductCategoryGroup,
          as: "directGroup",
          required: false,
        },
        {
          model: ProductCategory,
          as: "directCategory",
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

    return updatedProductLinks.map((pl) => pl.toJSON());
  }
}

module.exports = new ProductLinkService();
