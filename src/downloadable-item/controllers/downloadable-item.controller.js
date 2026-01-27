const downloadableItemService = require("../services/downloadable-item.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  DownloadableItemErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class DownloadableItemController {
  async createDownloadableItem(req, res) {
    try {
      const downloadableItem = await downloadableItemService.createDownloadableItem(req.body);
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.CREATE_SUCCESS, downloadableItem);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.CREATE_FAILED);
    }
  }

  async getAllDownloadableItems(req, res) {
    try {
      const downloadableItems = await downloadableItemService.getAllDownloadableItems();
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.QUERY_SUCCESS, downloadableItems);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.QUERY_FAILED);
    }
  }

  async getPublishedDownloadableItems(req, res) {
    try {
      const downloadableItems = await downloadableItemService.getPublishedDownloadableItems();
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.QUERY_SUCCESS, downloadableItems);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.QUERY_FAILED);
    }
  }

  async getPublishedDownloadableItemsGroupedByCategory(req, res) {
    try {
      const categories =
        await downloadableItemService.getPublishedDownloadableItemsGroupedByCategory();
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.QUERY_SUCCESS, categories);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.QUERY_FAILED);
    }
  }

  async getDownloadableItemById(req, res) {
    try {
      const downloadableItem = await downloadableItemService.getDownloadableItemById(
        req.params.id,
        true
      );
      if (!downloadableItem) {
        throw DownloadableItemErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.QUERY_SUCCESS, downloadableItem);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.QUERY_FAILED);
    }
  }

  async queryDownloadableItems(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await downloadableItemService.queryDownloadableItems({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.QUERY_FAILED);
    }
  }

  async updateDownloadableItem(req, res) {
    try {
      const downloadableItem = await downloadableItemService.updateDownloadableItem(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.UPDATE_SUCCESS, downloadableItem);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.UPDATE_FAILED);
    }
  }

  async deleteDownloadableItem(req, res) {
    try {
      await downloadableItemService.deleteDownloadableItem(req.params.id);
      handleSuccess(res, SUCCESS_CODES.DOWNLOADABLE_ITEM.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.DELETE_FAILED);
    }
  }

  async updateDownloadableItemStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedDownloadableItems = await downloadableItemService.updateDownloadableItemStatus(
        ids,
        status
      );
      handleSuccess(
        res,
        SUCCESS_CODES.DOWNLOADABLE_ITEM.UPDATE_SUCCESS,
        updatedDownloadableItems
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.DOWNLOADABLE_ITEM.UPDATE_FAILED);
    }
  }
}

module.exports = new DownloadableItemController();
