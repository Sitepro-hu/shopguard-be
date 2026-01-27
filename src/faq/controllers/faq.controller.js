const faqService = require("../services/faq.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  FAQErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class FAQController {
  async createFAQ(req, res) {
    try {
      const faq = await faqService.createFAQ(req.body);
      handleSuccess(res, SUCCESS_CODES.FAQ.CREATE_SUCCESS, faq);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.CREATE_FAILED);
    }
  }

  async getAllFAQs(req, res) {
    try {
      const faqs = await faqService.getAllFAQs();
      handleSuccess(res, SUCCESS_CODES.FAQ.QUERY_SUCCESS, faqs);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.QUERY_FAILED);
    }
  }

  async getPublishedFAQs(req, res) {
    try {
      const faqs = await faqService.getPublishedFAQs();
      handleSuccess(res, SUCCESS_CODES.FAQ.QUERY_SUCCESS, faqs);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.QUERY_FAILED);
    }
  }

  async getPublishedFAQsGroupedByCategory(req, res) {
    try {
      const categories = await faqService.getPublishedFAQsGroupedByCategory();
      handleSuccess(res, SUCCESS_CODES.FAQ.QUERY_SUCCESS, categories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.QUERY_FAILED);
    }
  }

  async getFAQById(req, res) {
    try {
      const faq = await faqService.getFAQById(req.params.id, true);
      if (!faq) {
        throw FAQErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.FAQ.QUERY_SUCCESS, faq);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.QUERY_FAILED);
    }
  }

  async queryFAQs(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await faqService.queryFAQs({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.FAQ.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.QUERY_FAILED);
    }
  }

  async updateFAQ(req, res) {
    try {
      const faq = await faqService.updateFAQ(req.params.id, req.body);
      handleSuccess(res, SUCCESS_CODES.FAQ.UPDATE_SUCCESS, faq);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.UPDATE_FAILED);
    }
  }

  async deleteFAQ(req, res) {
    try {
      await faqService.deleteFAQ(req.params.id);
      handleSuccess(res, SUCCESS_CODES.FAQ.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.DELETE_FAILED);
    }
  }

  async updateFAQStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedFAQs = await faqService.updateFAQsStatus(ids, status);
      handleSuccess(res, SUCCESS_CODES.FAQ.UPDATE_SUCCESS, updatedFAQs);
    } catch (error) {
      handleError(res, error, ERROR_CODES.FAQ.UPDATE_FAILED);
    }
  }
}

module.exports = new FAQController();
