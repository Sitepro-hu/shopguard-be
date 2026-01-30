const socialMediaPageService = require("../services/social-media-page.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  SocialMediaPageErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class SocialMediaPageController {
  async createSocialMediaPage(req, res) {
    try {
      const page = await socialMediaPageService.createSocialMediaPage(req.body);
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.CREATE_SUCCESS, page);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.CREATE_FAILED);
    }
  }

  async getAllSocialMediaPages(req, res) {
    try {
      const pages = await socialMediaPageService.getAllSocialMediaPages();
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.QUERY_SUCCESS, pages);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.QUERY_FAILED);
    }
  }

  async getPublishedSocialMediaPages(req, res) {
    try {
      const pages = await socialMediaPageService.getPublishedSocialMediaPages();
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.QUERY_SUCCESS, pages);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.QUERY_FAILED);
    }
  }

  async getSocialMediaPageById(req, res) {
    try {
      const page = await socialMediaPageService.getSocialMediaPageById(
        req.params.id,
        true
      );
      if (!page) throw SocialMediaPageErrors.notFound();
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.QUERY_SUCCESS, page);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.QUERY_FAILED);
    }
  }

  async querySocialMediaPages(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await socialMediaPageService.querySocialMediaPages({
        pagination,
        sort,
        search,
        filters,
      });
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.QUERY_FAILED);
    }
  }

  async updateSocialMediaPage(req, res) {
    try {
      const page = await socialMediaPageService.updateSocialMediaPage(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.UPDATE_SUCCESS, page);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.UPDATE_FAILED);
    }
  }

  async deleteSocialMediaPage(req, res) {
    try {
      await socialMediaPageService.deleteSocialMediaPage(req.params.id);
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.DELETE_FAILED);
    }
  }

  async updateSocialMediaPageStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const pages = await socialMediaPageService.updateSocialMediaPageStatus(ids, status);
      handleSuccess(res, SUCCESS_CODES.SOCIAL_MEDIA_PAGE.UPDATE_SUCCESS, pages);
    } catch (error) {
      handleError(res, error, ERROR_CODES.SOCIAL_MEDIA_PAGE.UPDATE_FAILED);
    }
  }
}

module.exports = new SocialMediaPageController();
