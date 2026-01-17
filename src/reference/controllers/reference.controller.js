const referenceService = require("../services/reference.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ReferenceErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class ReferenceController {
  async createReference(req, res) {
    try {
      const reference = await referenceService.createReference(req.body);
      handleSuccess(res, SUCCESS_CODES.REFERENCE.CREATE_SUCCESS, reference);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.CREATE_FAILED);
    }
  }

  async getAllReferences(req, res) {
    try {
      const references = await referenceService.getAllReferences();
      handleSuccess(res, SUCCESS_CODES.REFERENCE.QUERY_SUCCESS, references);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.QUERY_FAILED);
    }
  }

  async getPublishedReferences(req, res) {
    try {
      const references = await referenceService.getPublishedReferences();
      handleSuccess(res, SUCCESS_CODES.REFERENCE.QUERY_SUCCESS, references);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.QUERY_FAILED);
    }
  }

  async getReferenceById(req, res) {
    try {
      const reference = await referenceService.getReferenceById(
        req.params.id,
        true
      );
      if (!reference) {
        throw ReferenceErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.REFERENCE.QUERY_SUCCESS, reference);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.QUERY_FAILED);
    }
  }

  async getReferenceBySlug(req, res) {
    try {
      const { slug } = req.params;
      const reference = await referenceService.getReferenceBySlug(slug);
      if (!reference) {
        throw ReferenceErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.REFERENCE.QUERY_SUCCESS, reference);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.QUERY_FAILED);
    }
  }

  async queryReferences(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      // Publikus végpont esetén csak PUBLISHED státuszú referenciákat adunk vissza
      const isPublicRoute = !req.headers.authorization;
      const result = await referenceService.queryReferences({
        pagination,
        sort,
        search,
        filters,
        publishedOnly: isPublicRoute,
      });

      handleSuccess(res, SUCCESS_CODES.REFERENCE.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.QUERY_FAILED);
    }
  }

  async updateReference(req, res) {
    try {
      const reference = await referenceService.updateReference(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.REFERENCE.UPDATE_SUCCESS, reference);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.UPDATE_FAILED);
    }
  }

  async deleteReference(req, res) {
    try {
      await referenceService.deleteReference(req.params.id);
      handleSuccess(res, SUCCESS_CODES.REFERENCE.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.DELETE_FAILED);
    }
  }

  async updateReferenceStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedReferences = await referenceService.updateReferenceStatus(
        ids,
        status
      );
      handleSuccess(
        res,
        SUCCESS_CODES.REFERENCE.UPDATE_SUCCESS,
        updatedReferences
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.REFERENCE.UPDATE_FAILED);
    }
  }
}

module.exports = new ReferenceController();
