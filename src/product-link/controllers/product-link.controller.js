const productLinkService = require("../services/product-link.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ProductLinkErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class ProductLinkController {
  async createProductLink(req, res) {
    try {
      const productLink = await productLinkService.createProductLink(req.body);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.CREATE_SUCCESS, productLink);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.CREATE_FAILED);
    }
  }

  async getAllProductLinks(req, res) {
    try {
      const productLinks = await productLinkService.getAllProductLinks();
      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.QUERY_SUCCESS, productLinks);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.QUERY_FAILED);
    }
  }

  async getProductLinkById(req, res) {
    try {
      const productLink = await productLinkService.getProductLinkById(req.params.id, true);
      if (!productLink) {
        throw ProductLinkErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.QUERY_SUCCESS, productLink);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.QUERY_FAILED);
    }
  }

  async queryProductLinks(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await productLinkService.queryProductLinks({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.QUERY_FAILED);
    }
  }

  async updateProductLink(req, res) {
    try {
      const productLink = await productLinkService.updateProductLink(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.UPDATE_SUCCESS, productLink);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.UPDATE_FAILED);
    }
  }

  async deleteProductLink(req, res) {
    try {
      await productLinkService.deleteProductLink(req.params.id);
      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.DELETE_FAILED);
    }
  }

  async updateProductLinkStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedProductLinks = await productLinkService.updateProductLinkStatus(
        ids,
        status
      );
      handleSuccess(res, SUCCESS_CODES.PRODUCT_LINK.UPDATE_SUCCESS, updatedProductLinks);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT_LINK.UPDATE_FAILED);
    }
  }
}

module.exports = new ProductLinkController();
