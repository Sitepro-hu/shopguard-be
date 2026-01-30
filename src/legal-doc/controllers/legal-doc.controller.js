const legalDocService = require("../services/legal-doc.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  LegalDocErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class LegalDocController {
  async createLegalDoc(req, res) {
    try {
      const doc = await legalDocService.createLegalDoc(req.body);
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.CREATE_SUCCESS, doc);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.CREATE_FAILED);
    }
  }

  async getAllLegalDocs(req, res) {
    try {
      const docs = await legalDocService.getAllLegalDocs();
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.QUERY_SUCCESS, docs);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.QUERY_FAILED);
    }
  }

  async getPublishedLegalDocs(req, res) {
    try {
      const docs = await legalDocService.getPublishedLegalDocs();
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.QUERY_SUCCESS, docs);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.QUERY_FAILED);
    }
  }

  async getLegalDocById(req, res) {
    try {
      const doc = await legalDocService.getLegalDocById(
        req.params.id,
        true
      );
      if (!doc) throw LegalDocErrors.notFound();
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.QUERY_SUCCESS, doc);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.QUERY_FAILED);
    }
  }

  async getLegalDocBySlug(req, res) {
    try {
      const doc = await legalDocService.getLegalDocBySlug(req.params.slug);
      if (!doc) throw LegalDocErrors.notFound();
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.QUERY_SUCCESS, doc);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.QUERY_FAILED);
    }
  }

  async queryLegalDocs(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await legalDocService.queryLegalDocs({
        pagination,
        sort,
        search,
        filters,
      });
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.QUERY_FAILED);
    }
  }

  async updateLegalDoc(req, res) {
    try {
      const doc = await legalDocService.updateLegalDoc(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.UPDATE_SUCCESS, doc);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.UPDATE_FAILED);
    }
  }

  async deleteLegalDoc(req, res) {
    try {
      await legalDocService.deleteLegalDoc(req.params.id);
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.DELETE_FAILED);
    }
  }

  async updateLegalDocStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const docs = await legalDocService.updateLegalDocStatus(ids, status);
      handleSuccess(res, SUCCESS_CODES.LEGAL_DOC.UPDATE_SUCCESS, docs);
    } catch (error) {
      handleError(res, error, ERROR_CODES.LEGAL_DOC.UPDATE_FAILED);
    }
  }
}

module.exports = new LegalDocController();
