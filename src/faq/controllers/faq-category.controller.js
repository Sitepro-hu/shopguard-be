const faqCategoryService = require("../services/faq-category.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  FAQCategoryErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class FaqCategoryController {
  async createFaqCategory(req, res) {
    try {
      const category = await faqCategoryService.createFaqCategory(req.body);
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.CREATE_SUCCESS, category);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.CREATE_FAILED);
    }
  }

  async getAllFaqCategories(req, res) {
    try {
      const categories = await faqCategoryService.getAllFaqCategories();
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.QUERY_SUCCESS, categories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.QUERY_FAILED);
    }
  }

  async getPublishedFaqCategories(req, res) {
    try {
      const categories = await faqCategoryService.getPublishedFaqCategories();
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.QUERY_SUCCESS, categories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.QUERY_FAILED);
    }
  }

  async getFaqCategoryById(req, res) {
    try {
      const category = await faqCategoryService.getFaqCategoryById(
        req.params.id
      );
      if (!category) {
        throw FAQCategoryErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.QUERY_SUCCESS, category);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.QUERY_FAILED);
    }
  }

  async updateFaqCategory(req, res) {
    try {
      const category = await faqCategoryService.updateFaqCategory(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.UPDATE_SUCCESS, category);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.UPDATE_FAILED);
    }
  }

  async deleteFaqCategory(req, res) {
    try {
      await faqCategoryService.deleteFaqCategory(req.params.id);
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.DELETE_FAILED);
    }
  }

  async queryFaqCategories(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;

      const result = await faqCategoryService.queryFaqCategories({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.QUERY_FAILED);
    }
  }

  async updateFaqCategoryStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedCategories =
        await faqCategoryService.updateFaqCategoryStatus(ids, status);
      handleSuccess(res, SUCCESS_CODES.FAQ_CATEGORY.UPDATE_SUCCESS, updatedCategories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ_CATEGORY.UPDATE_FAILED);
    }
  }
}

module.exports = new FaqCategoryController();
