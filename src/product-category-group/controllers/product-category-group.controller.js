const productCategoryGroupService = require("../services/product-category-group.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ProductCategoryGroupErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class ProductCategoryGroupController {
  async createProductCategoryGroup(req, res) {
    try {
      const productCategoryGroup = await productCategoryGroupService.createProductCategoryGroup(req.body);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.CREATE_SUCCESS, productCategoryGroup);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.CREATE_FAILED);
    }
  }

  async getAllProductCategoryGroups(req, res) {
    try {
      const productCategoryGroups = await productCategoryGroupService.getAllProductCategoryGroups();
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.QUERY_SUCCESS, productCategoryGroups);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.QUERY_FAILED);
    }
  }

  async getPublishedProductCategoryGroups(req, res) {
    try {
      const productCategoryGroups = await productCategoryGroupService.getPublishedProductCategoryGroups();
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.QUERY_SUCCESS, productCategoryGroups);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.QUERY_FAILED);
    }
  }

  async getProductCategoryGroupById(req, res) {
    try {
      const productCategoryGroup = await productCategoryGroupService.getProductCategoryGroupById(
        req.params.id,
        true
      );
      if (!productCategoryGroup) {
        throw ProductCategoryGroupErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.QUERY_SUCCESS, productCategoryGroup);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.QUERY_FAILED);
    }
  }

  async queryProductCategoryGroups(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await productCategoryGroupService.queryProductCategoryGroups({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.QUERY_FAILED);
    }
  }

  async updateProductCategoryGroup(req, res) {
    try {
      const productCategoryGroup = await productCategoryGroupService.updateProductCategoryGroup(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.UPDATE_SUCCESS, productCategoryGroup);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.UPDATE_FAILED);
    }
  }

  async deleteProductCategoryGroup(req, res) {
    try {
      await productCategoryGroupService.deleteProductCategoryGroup(req.params.id);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.DELETE_FAILED);
    }
  }

  async updateProductCategoryGroupStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedProductCategoryGroups =
        await productCategoryGroupService.updateProductCategoryGroupStatus(ids, status);
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_CATEGORY_GROUP.UPDATE_SUCCESS,
        updatedProductCategoryGroups
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY_GROUP.UPDATE_FAILED);
    }
  }
}

module.exports = new ProductCategoryGroupController();
