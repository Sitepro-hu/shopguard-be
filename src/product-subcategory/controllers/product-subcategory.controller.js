const productSubcategoryService = require("../services/product-subcategory.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ProductSubcategoryErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class ProductSubcategoryController {
  async createProductSubcategory(req, res) {
    try {
      const productSubcategory =
        await productSubcategoryService.createProductSubcategory(req.body);
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_SUBCATEGORY.CREATE_SUCCESS,
        productSubcategory
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.CREATE_FAILED);
    }
  }

  async getAllProductSubcategories(req, res) {
    try {
      const productSubcategories =
        await productSubcategoryService.getAllProductSubcategories();
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_SUBCATEGORY.QUERY_SUCCESS,
        productSubcategories
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.QUERY_FAILED);
    }
  }

  async getProductSubcategoryBySlug(req, res) {
    try {
      const { slug } = req.params;
      const productSubcategory =
        await productSubcategoryService.getProductSubcategoryBySlug(slug);
      if (!productSubcategory) {
        throw ProductSubcategoryErrors.notFound();
      }
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_SUBCATEGORY.QUERY_SUCCESS,
        productSubcategory
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.QUERY_FAILED);
    }
  }

  async getProductSubcategoryById(req, res) {
    try {
      const productSubcategory =
        await productSubcategoryService.getProductSubcategoryById(
          req.params.id,
          true
        );
      if (!productSubcategory) {
        throw ProductSubcategoryErrors.notFound();
      }
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_SUBCATEGORY.QUERY_SUCCESS,
        productSubcategory
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.QUERY_FAILED);
    }
  }

  async queryProductSubcategories(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await productSubcategoryService.queryProductSubcategories({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.PRODUCT_SUBCATEGORY.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.QUERY_FAILED);
    }
  }

  async updateProductSubcategory(req, res) {
    try {
      const productSubcategory =
        await productSubcategoryService.updateProductSubcategory(
          req.params.id,
          req.body
        );
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_SUBCATEGORY.UPDATE_SUCCESS,
        productSubcategory
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.UPDATE_FAILED);
    }
  }

  async deleteProductSubcategory(req, res) {
    try {
      await productSubcategoryService.deleteProductSubcategory(req.params.id);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_SUBCATEGORY.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.DELETE_FAILED);
    }
  }

  async updateProductSubcategoryStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedProductSubcategories =
        await productSubcategoryService.updateProductSubcategoryStatus(
          ids,
          status
        );
      handleSuccess(
        res,
        SUCCESS_CODES.PRODUCT_SUBCATEGORY.UPDATE_SUCCESS,
        updatedProductSubcategories
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_SUBCATEGORY.UPDATE_FAILED);
    }
  }
}

module.exports = new ProductSubcategoryController();
