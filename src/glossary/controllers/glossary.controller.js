const glossaryService = require("../services/glossary.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  GlossaryErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class GlossaryController {
  async createGlossary(req, res) {
    try {
      const glossary = await glossaryService.createGlossary(req.body);
      handleSuccess(res, SUCCESS_CODES.GLOSSARY.CREATE_SUCCESS, glossary);
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.CREATE_FAILED);
    }
  }

  async getAllGlossaries(req, res) {
    try {
      const glossaries = await glossaryService.getAllGlossaries();
      handleSuccess(res, SUCCESS_CODES.GLOSSARY.QUERY_SUCCESS, glossaries);
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.QUERY_FAILED);
    }
  }

  async getPublishedGlossaries(req, res) {
    try {
      const glossaries = await glossaryService.getPublishedGlossaries();
      handleSuccess(res, SUCCESS_CODES.GLOSSARY.QUERY_SUCCESS, glossaries);
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.QUERY_FAILED);
    }
  }

  async getGlossaryById(req, res) {
    try {
      const glossary = await glossaryService.getGlossaryById(
        req.params.id,
        true
      );
      if (!glossary) {
        throw GlossaryErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.GLOSSARY.QUERY_SUCCESS, glossary);
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.QUERY_FAILED);
    }
  }

  async queryGlossaries(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await glossaryService.queryGlossaries({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.GLOSSARY.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.QUERY_FAILED);
    }
  }

  async updateGlossary(req, res) {
    try {
      const glossary = await glossaryService.updateGlossary(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.GLOSSARY.UPDATE_SUCCESS, glossary);
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.UPDATE_FAILED);
    }
  }

  async deleteGlossary(req, res) {
    try {
      await glossaryService.deleteGlossary(req.params.id);
      handleSuccess(res, SUCCESS_CODES.GLOSSARY.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.DELETE_FAILED);
    }
  }

  async updateGlossaryStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedGlossaries =
        await glossaryService.updateGlossaryStatus(ids, status);
      handleSuccess(
        res,
        SUCCESS_CODES.GLOSSARY.UPDATE_SUCCESS,
        updatedGlossaries
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.GLOSSARY.UPDATE_FAILED);
    }
  }
}

module.exports = new GlossaryController();
