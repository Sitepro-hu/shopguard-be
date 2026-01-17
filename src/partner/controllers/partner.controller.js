const partnerService = require("../services/partner.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  PartnerErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class PartnerController {
  async createPartner(req, res) {
    try {
      const partner = await partnerService.createPartner(req.body);
      handleSuccess(res, SUCCESS_CODES.PARTNER.CREATE_SUCCESS, partner);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.CREATE_FAILED);
    }
  }

  async getAllPartners(req, res) {
    try {
      const partners = await partnerService.getAllPartners();
      handleSuccess(res, SUCCESS_CODES.PARTNER.QUERY_SUCCESS, partners);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.QUERY_FAILED);
    }
  }

  async getPublishedPartners(req, res) {
    try {
      const partners = await partnerService.getPublishedPartners();
      handleSuccess(res, SUCCESS_CODES.PARTNER.QUERY_SUCCESS, partners);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.QUERY_FAILED);
    }
  }

  async getPartnerById(req, res) {
    try {
      const partner = await partnerService.getPartnerById(
        req.params.id,
        true
      );
      if (!partner) {
        throw PartnerErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.PARTNER.QUERY_SUCCESS, partner);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.QUERY_FAILED);
    }
  }

  async queryPartners(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await partnerService.queryPartners({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.PARTNER.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.QUERY_FAILED);
    }
  }

  async updatePartner(req, res) {
    try {
      const partner = await partnerService.updatePartner(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.PARTNER.UPDATE_SUCCESS, partner);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.UPDATE_FAILED);
    }
  }

  async deletePartner(req, res) {
    try {
      await partnerService.deletePartner(req.params.id);
      handleSuccess(res, SUCCESS_CODES.PARTNER.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.DELETE_FAILED);
    }
  }

  async updatePartnerStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedPartners = await partnerService.updatePartnerStatus(
        ids,
        status
      );
      handleSuccess(
        res,
        SUCCESS_CODES.PARTNER.UPDATE_SUCCESS,
        updatedPartners
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.PARTNER.UPDATE_FAILED);
    }
  }
}

module.exports = new PartnerController();
