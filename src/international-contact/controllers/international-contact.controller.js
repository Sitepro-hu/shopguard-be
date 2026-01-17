const internationalContactService = require("../services/international-contact.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  InternationalContactErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class InternationalContactController {
  async createInternationalContact(req, res) {
    try {
      const internationalContact = await internationalContactService.createInternationalContact(req.body);
      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.CREATE_SUCCESS, internationalContact);
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.CREATE_FAILED);
    }
  }

  async getAllInternationalContacts(req, res) {
    try {
      const internationalContacts = await internationalContactService.getAllInternationalContacts();
      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.QUERY_SUCCESS, internationalContacts);
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.QUERY_FAILED);
    }
  }

  async getPublishedInternationalContacts(req, res) {
    try {
      const internationalContacts = await internationalContactService.getPublishedInternationalContacts();
      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.QUERY_SUCCESS, internationalContacts);
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.QUERY_FAILED);
    }
  }

  async getInternationalContactById(req, res) {
    try {
      const internationalContact = await internationalContactService.getInternationalContactById(
        req.params.id,
        true
      );
      if (!internationalContact) {
        throw InternationalContactErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.QUERY_SUCCESS, internationalContact);
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.QUERY_FAILED);
    }
  }

  async queryInternationalContacts(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await internationalContactService.queryInternationalContacts({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.QUERY_FAILED);
    }
  }

  async updateInternationalContact(req, res) {
    try {
      const internationalContact = await internationalContactService.updateInternationalContact(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.UPDATE_SUCCESS, internationalContact);
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.UPDATE_FAILED);
    }
  }

  async deleteInternationalContact(req, res) {
    try {
      await internationalContactService.deleteInternationalContact(req.params.id);
      handleSuccess(res, SUCCESS_CODES.INTERNATIONAL_CONTACT.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.DELETE_FAILED);
    }
  }

  async updateInternationalContactStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedInternationalContacts = await internationalContactService.updateInternationalContactStatus(
        ids,
        status
      );
      handleSuccess(
        res,
        SUCCESS_CODES.INTERNATIONAL_CONTACT.UPDATE_SUCCESS,
        updatedInternationalContacts
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.INTERNATIONAL_CONTACT.UPDATE_FAILED);
    }
  }
}

module.exports = new InternationalContactController();
