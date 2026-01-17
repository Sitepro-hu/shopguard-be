const mediaService = require("../services/media.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  MediaErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class MediaController {
  async createMedia(req, res) {
    try {
      const media = await mediaService.createMedia(req.body);
      handleSuccess(res, SUCCESS_CODES.MEDIA.CREATE_SUCCESS, media);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.CREATE_FAILED);
    }
  }

  async getAllMedia(req, res) {
    try {
      const media = await mediaService.getAllMedia();
      handleSuccess(res, SUCCESS_CODES.MEDIA.QUERY_SUCCESS, media);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.QUERY_FAILED);
    }
  }

  async getPublishedMedia(req, res) {
    try {
      const media = await mediaService.getPublishedMedia();
      handleSuccess(res, SUCCESS_CODES.MEDIA.QUERY_SUCCESS, media);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.QUERY_FAILED);
    }
  }

  async getMediaById(req, res) {
    try {
      const media = await mediaService.getMediaById(
        req.params.id,
        true
      );
      if (!media) {
        throw MediaErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.MEDIA.QUERY_SUCCESS, media);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.QUERY_FAILED);
    }
  }

  async getMediaBySlug(req, res) {
    try {
      const { slug } = req.params;
      const media = await mediaService.getMediaBySlug(slug);
      if (!media) {
        throw MediaErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.MEDIA.QUERY_SUCCESS, media);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.QUERY_FAILED);
    }
  }

  async queryMedia(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      // Publikus végpont esetén csak PUBLISHED státuszú média adunk vissza
      const isPublicRoute = !req.headers.authorization;
      const result = await mediaService.queryMedia({
        pagination,
        sort,
        search,
        filters,
        publishedOnly: isPublicRoute,
      });

      handleSuccess(res, SUCCESS_CODES.MEDIA.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.QUERY_FAILED);
    }
  }

  async updateMedia(req, res) {
    try {
      const media = await mediaService.updateMedia(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.MEDIA.UPDATE_SUCCESS, media);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.UPDATE_FAILED);
    }
  }

  async deleteMedia(req, res) {
    try {
      await mediaService.deleteMedia(req.params.id);
      handleSuccess(res, SUCCESS_CODES.MEDIA.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.DELETE_FAILED);
    }
  }

  async updateMediaStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedMedia = await mediaService.updateMediaStatus(
        ids,
        status
      );
      handleSuccess(
        res,
        SUCCESS_CODES.MEDIA.UPDATE_SUCCESS,
        updatedMedia
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.MEDIA.UPDATE_FAILED);
    }
  }
}

module.exports = new MediaController();
