const productCategoryService = require("../services/product-category.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ProductCategoryErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class ProductCategoryController {
  async createProductCategory(req, res) {
    try {
      const productCategory = await productCategoryService.createProductCategory(req.body);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.CREATE_SUCCESS, productCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.CREATE_FAILED);
    }
  }

  async getAllProductCategories(req, res) {
    try {
      const productCategories = await productCategoryService.getAllProductCategories();
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.QUERY_SUCCESS, productCategories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.QUERY_FAILED);
    }
  }

  async getPublishedProductCategories(req, res) {
    try {
      const productCategories = await productCategoryService.getPublishedProductCategories();
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.QUERY_SUCCESS, productCategories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.QUERY_FAILED);
    }
  }

  async getProductCategoryBySlug(req, res) {
    try {
      const { slug } = req.params;
      const productCategory = await productCategoryService.getProductCategoryBySlug(slug);
      if (!productCategory) {
        throw ProductCategoryErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.QUERY_SUCCESS, productCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.QUERY_FAILED);
    }
  }

  async getProductCategoryById(req, res) {
    try {
      const productCategory = await productCategoryService.getProductCategoryById(
        req.params.id,
        true
      );
      if (!productCategory) {
        throw ProductCategoryErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.QUERY_SUCCESS, productCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.QUERY_FAILED);
    }
  }

  async queryProductCategories(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await productCategoryService.queryProductCategories({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.QUERY_FAILED);
    }
  }

  async updateProductCategory(req, res) {
    try {
      const productCategory = await productCategoryService.updateProductCategory(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.UPDATE_SUCCESS, productCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.UPDATE_FAILED);
    }
  }

  async deleteProductCategory(req, res) {
    try {
      await productCategoryService.deleteProductCategory(req.params.id);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_CATEGORY.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED);
    }
  }

  async updateProductCategoryStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedProductCategories =
        await productCategoryService.updateProductCategoryStatus(ids, status);
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_CATEGORY.UPDATE_SUCCESS,
        updatedProductCategories
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_CATEGORY.UPDATE_FAILED);
    }
  }
}

module.exports = new ProductCategoryController();
