const downloadableCategoryService = require("../services/downloadable-category.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  DownloadableCategoryErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class DownloadableCategoryController {
  async createDownloadableCategory(req, res) {
    try {
      const downloadableCategory = await downloadableCategoryService.createDownloadableCategory(req.body);
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_CATEGORY.CREATE_SUCCESS, downloadableCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.CREATE_FAILED);
    }
  }

  async getAllDownloadableCategories(req, res) {
    try {
      const downloadableCategories = await downloadableCategoryService.getAllDownloadableCategories();
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_CATEGORY.QUERY_SUCCESS, downloadableCategories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.QUERY_FAILED);
    }
  }

  async getDownloadableCategoryById(req, res) {
    try {
      const downloadableCategory = await downloadableCategoryService.getDownloadableCategoryById(
        req.params.id,
        true
      );
      if (!downloadableCategory) {
        throw DownloadableCategoryErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_CATEGORY.QUERY_SUCCESS, downloadableCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.QUERY_FAILED);
    }
  }

  async queryDownloadableCategories(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await downloadableCategoryService.queryDownloadableCategories({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_CATEGORY.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.QUERY_FAILED);
    }
  }

  async updateDownloadableCategory(req, res) {
    try {
      const downloadableCategory = await downloadableCategoryService.updateDownloadableCategory(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_CATEGORY.UPDATE_SUCCESS, downloadableCategory);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.UPDATE_FAILED);
    }
  }

  async deleteDownloadableCategory(req, res) {
    try {
      await downloadableCategoryService.deleteDownloadableCategory(req.params.id);
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_CATEGORY.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.DELETE_FAILED);
    }
  }

  async updateDownloadableCategoryStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedDownloadableCategories = await downloadableCategoryService.updateDownloadableCategoryStatus(
        ids,
        status
      );
      handleSuccess(
        res,
        SUCCESS_CODES.DOWNLOADABLE_CATEGORY.UPDATE_SUCCESS,
        updatedDownloadableCategories
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_CATEGORY.UPDATE_FAILED);
    }
  }
}

module.exports = new DownloadableCategoryController();
