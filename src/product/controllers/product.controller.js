const productService = require("../services/product.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ProductErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      handleSuccess(res, SUCCESS_CODES.PRODUCT.CREATE_SUCCESS, product);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.CREATE_FAILED);
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      handleSuccess(res, SUCCESS_CODES.PRODUCT.QUERY_SUCCESS, products);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.QUERY_FAILED);
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id, true);
      if (!product) {
        throw ProductErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PRODUCT.QUERY_SUCCESS, product);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.QUERY_FAILED);
    }
  }

  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const product = await productService.getProductBySlug(slug);
      if (!product) {
        throw ProductErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PRODUCT.QUERY_SUCCESS, product);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.QUERY_FAILED);
    }
  }

  async queryProducts(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await productService.queryProducts({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.PRODUCT.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.QUERY_FAILED);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.PRODUCT.UPDATE_SUCCESS, product);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.UPDATE_FAILED);
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      handleSuccess(res, SUCCESS_CODES.PRODUCT.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.DELETE_FAILED);
    }
  }

  async updateProductStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedProducts = await productService.updateProductStatus(
        ids,
        status
      );
      handleSuccess(res, SUCCESS_CODES.PRODUCT.UPDATE_SUCCESS, updatedProducts);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PRODUCT.UPDATE_FAILED);
    }
  }
}

module.exports = new ProductController();
