const contactService = require("../services/contact.service");
const { sendingContactEmail } = require("../services/contact-email.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  ContactErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

// Új Contact létrehozása
exports.createContact = async (req, res) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      telephone: req.body.telephone,
      message: req.body.message,
      privacyPolicy: req.body.privacyPolicy,
      status: "UNREAD",
    };

    const newContact = await contactService.createContact(contact);
    await sendingContactEmail(newContact);

    handleSuccess(res, SUCCESS_CODES.CONTACT.CREATE_SUCCESS, newContact);
  } catch (error) {
    handleError(res, error, ERROR_CODES.CONTACT.CREATE_FAILED);
  }
};

// Minden Contact lekérdezése
exports.getContacts = async (req, res) => {
  try {
    const contacts = await contactService.getContacts();

    handleSuccess(res, SUCCESS_CODES.CONTACT.QUERY_SUCCESS, contacts);
  } catch (error) {
    handleError(res, error, ERROR_CODES.CONTACT.QUERY_FAILED);
  }
};

// Egy Contact lekérdezése ID alapján
exports.getContactById = async (req, res) => {
  try {
    const contact = await contactService.getContactById(req.params.id, true, true);

    if (!contact) {
      throw ContactErrors.notFound();
    }

    handleSuccess(res, SUCCESS_CODES.CONTACT.QUERY_SUCCESS, contact);
  } catch (error) {
    handleError(res, error, ERROR_CODES.CONTACT.QUERY_FAILED);
  }
};

// Contact-ek státusz frissítése
exports.updateContactStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    const updatedContacts = await contactService.updateContactStatus(
      ids,
      status
    );

    handleSuccess(res, SUCCESS_CODES.CONTACT.UPDATE_SUCCESS, updatedContacts);
  } catch (error) {
    handleError(res, error, ERROR_CODES.CONTACT.UPDATE_FAILED);
  }
};

// Contact törlése
exports.removeContact = async (req, res) => {
  try {
    const deletedContact = await contactService.removeContact(req.params.id);

    if (!deletedContact) {
      throw ContactErrors.notFound();
    }

    handleSuccess(res, SUCCESS_CODES.CONTACT.DELETE_SUCCESS);
  } catch (error) {
    handleError(res, error, ERROR_CODES.CONTACT.DELETE_FAILED);
  }
};

// Contact-ek query alapú lekérdezése
exports.queryContacts = async (req, res) => {
  try {
    const { pagination, sort, search, filters } = req.body;

    const result = await contactService.queryContacts({
      pagination,
      sort,
      search,
      filters,
    });

    handleSuccess(res, SUCCESS_CODES.CONTACT.QUERY_SUCCESS, {
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    handleError(res, error, ERROR_CODES.CONTACT.QUERY_FAILED);
  }
};
