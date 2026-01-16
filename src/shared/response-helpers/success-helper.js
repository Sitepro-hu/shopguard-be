const messages = require("../locales/hu.json");

/**
 * Success kódok definíciója
 */
const SUCCESS_CODES = {
  // Subscriber sikeres műveletek
  SUBSCRIBER: {
    CREATE_SUCCESS: "SUBSCRIBER.CREATE_SUCCESS",
    UPDATE_SUCCESS: "SUBSCRIBER.UPDATE_SUCCESS",
    DELETE_SUCCESS: "SUBSCRIBER.DELETE_SUCCESS",
    QUERY_SUCCESS: "SUBSCRIBER.QUERY_SUCCESS",
  },

  // User sikeres műveletek
  USER: {
    CREATE_SUCCESS: "USER.CREATE_SUCCESS",
    UPDATE_SUCCESS: "USER.UPDATE_SUCCESS",
    DELETE_SUCCESS: "USER.DELETE_SUCCESS",
    QUERY_SUCCESS: "USER.QUERY_SUCCESS",
    PASSWORD_CHANGE_SUCCESS: "USER.PASSWORD_CHANGE_SUCCESS",
  },

  // FAQ sikeres műveletek
  FAQ: {
    CREATE_SUCCESS: "FAQ.CREATE_SUCCESS",
    UPDATE_SUCCESS: "FAQ.UPDATE_SUCCESS",
    DELETE_SUCCESS: "FAQ.DELETE_SUCCESS",
    QUERY_SUCCESS: "FAQ.QUERY_SUCCESS",
  },

  // FAQ Category sikeres műveletek
  FAQ_CATEGORY: {
    CREATE_SUCCESS: "FAQ_CATEGORY.CREATE_SUCCESS",
    UPDATE_SUCCESS: "FAQ_CATEGORY.UPDATE_SUCCESS",
    DELETE_SUCCESS: "FAQ_CATEGORY.DELETE_SUCCESS",
    QUERY_SUCCESS: "FAQ_CATEGORY.QUERY_SUCCESS",
  },

  // Testimonial sikeres műveletek
  TESTIMONIAL: {
    CREATE_SUCCESS: "TESTIMONIAL.CREATE_SUCCESS",
    UPDATE_SUCCESS: "TESTIMONIAL.UPDATE_SUCCESS",
    DELETE_SUCCESS: "TESTIMONIAL.DELETE_SUCCESS",
    QUERY_SUCCESS: "TESTIMONIAL.QUERY_SUCCESS",
  },

  // Contact sikeres műveletek
  CONTACT: {
    CREATE_SUCCESS: "CONTACT.CREATE_SUCCESS",
    UPDATE_SUCCESS: "CONTACT.UPDATE_SUCCESS",
    DELETE_SUCCESS: "CONTACT.DELETE_SUCCESS",
    QUERY_SUCCESS: "CONTACT.QUERY_SUCCESS",
  },

  // File sikeres műveletek
  FILE: {
    UPLOAD_SUCCESS: "FILE.UPLOAD_SUCCESS",
    UPDATE_SUCCESS: "FILE.UPDATE_SUCCESS",
    DELETE_SUCCESS: "FILE.DELETE_SUCCESS",
    QUERY_SUCCESS: "FILE.QUERY_SUCCESS",
  },

  // Auth sikeres műveletek
  AUTH: {
    LOGIN_SUCCESS: "AUTH.LOGIN_SUCCESS",
    LOGOUT_SUCCESS: "AUTH.LOGOUT_SUCCESS",
    REGISTER_SUCCESS: "AUTH.REGISTER_SUCCESS",
    REFRESH_SUCCESS: "AUTH.REFRESH_SUCCESS",
  },

  // Email verifikáció sikeres műveletek
  EMAIL_VERIFICATION: {
    SEND_SUCCESS: "EMAIL_VERIFICATION.SEND_SUCCESS",
    VERIFY_SUCCESS: "EMAIL_VERIFICATION.VERIFY_SUCCESS",
  },

  // Password reset sikeres műveletek
  PASSWORD_RESET: {
    REQUEST_SUCCESS: "PASSWORD_RESET.REQUEST_SUCCESS",
    RESET_SUCCESS: "PASSWORD_RESET.RESET_SUCCESS",
  },
};

/**
 * Default success messages minden success kódhoz
 */

/**
 * Success üzenet lekérése a hu.json fájlból
 * @param {string} successCode - Success kód (pl. "USER.CREATE_SUCCESS")
 * @returns {string} Success üzenet
 */
function getSuccessMessage(successCode) {
  const [category, code] = successCode.split(".");
  return messages.success[category]?.[code] || "👍 Sikeres művelet!";
}

/**
 * Dinamikus success generátor függvény
 * @param {string} successCode - Success kód
 * @param {any} details - Opcionális részletes információk
 * @returns {string} Success üzenet
 */
function createSuccessMessage(successCode, details = null) {
  const message = getSuccessMessage(successCode);
  return message;
}

/**
 * Egyszerűsített handleSuccess függvény
 * @param {Response} res - Express response objektum
 * @param {string} successCode - Success kód (pl. SUCCESS_CODES.SUBSCRIBER.CREATE_SUCCESS)
 * @param {any} data - Válasz adat
 * @param {any} details - Opcionális részletes információk
 * @returns {void}
 */
function handleSuccess(res, successCode, data = null, details = null) {
  const message = createSuccessMessage(successCode, details);

  // Konzisztens formátum az error response-szal
  return res.status(200).json({
    status: "OK",
    message,
    data,
    messageCode: successCode,
    ...(details && { details }),
  });
}

module.exports = {
  SUCCESS_CODES,
  createSuccessMessage,
  handleSuccess,
  getSuccessMessage,
};
