const { ERROR_CODES, errorResponse } = require("./response-helper");
const messages = require("../locales/hu.json");

/**
 * Strukturált error objektum létrehozása
 * @param {string} code - Error kód (pl. "USER.NOT_FOUND")
 * @param {string} message - Felhasználóbarát hibaüzenet
 * @param {any} details - Opcionális részletes információk
 * @returns {Error} Strukturált error objektum
 */
function createError(code, message, details = null) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  error.isStructured = true;
  return error;
}

/**
 * Error üzenet lekérése a hu.json fájlból
 * @param {string} errorCode - Error kód (pl. "USER.NOT_FOUND")
 * @returns {string} Error üzenet
 */
function getErrorMessage(errorCode) {
  const [category, code] = errorCode.split(".");
  return messages.errors[category]?.[code] || "Ismeretlen hiba történt!";
}

/**
 * Dinamikus error generátor függvény
 * @param {string} errorCode - Error kód
 * @param {any} details - Opcionális részletes információk
 * @returns {Error} Strukturált error objektum
 */
function createStructuredError(errorCode, details = null) {
  const message = getErrorMessage(errorCode);
  return createError(errorCode, message, details);
}

/**
 * User hibák
 */
const UserErrors = {
  notFound: () => createStructuredError(ERROR_CODES.USER.NOT_FOUND),
  passwordMismatch: () =>
    createStructuredError(ERROR_CODES.USER.PASSWORD_MISMATCH),
  emailExists: () => createStructuredError(ERROR_CODES.USER.EMAIL_EXISTS),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.USER.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.USER.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.USER.DELETE_FAILED, details),
  passwordChangeFailed: (details) =>
    createStructuredError(ERROR_CODES.USER.PASSWORD_CHANGE_FAILED, details),
};

/**
 * FAQ hibák
 */
const FAQErrors = {
  notFound: () => createStructuredError(ERROR_CODES.FAQ.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.FAQ.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.FAQ.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.FAQ.DELETE_FAILED, details),
};

/**
 * FAQ Category hibák
 */
const FAQCategoryErrors = {
  notFound: () => createStructuredError(ERROR_CODES.FAQ_CATEGORY.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.FAQ_CATEGORY.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.FAQ_CATEGORY.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.FAQ_CATEGORY.DELETE_FAILED, details),
};

/**
 * Subscriber hibák
 */
const SubscriberErrors = {
  notFound: () => createStructuredError(ERROR_CODES.SUBSCRIBER.NOT_FOUND),
  emailExists: () => createStructuredError(ERROR_CODES.SUBSCRIBER.EMAIL_EXISTS),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.SUBSCRIBER.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.SUBSCRIBER.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.SUBSCRIBER.DELETE_FAILED, details),
  queryFailed: (details) =>
    createStructuredError(ERROR_CODES.SUBSCRIBER.QUERY_FAILED, details),
};

/**
 * Testimonial hibák
 */
const TestimonialErrors = {
  notFound: () => createStructuredError(ERROR_CODES.TESTIMONIAL.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.TESTIMONIAL.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.TESTIMONIAL.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.TESTIMONIAL.DELETE_FAILED, details),
};

/**
 * Hero Slider hibák
 */
const HeroSliderErrors = {
  notFound: () => createStructuredError(ERROR_CODES.HERO_SLIDER.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.HERO_SLIDER.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.HERO_SLIDER.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.HERO_SLIDER.DELETE_FAILED, details),
};

/**
 * Product Category Group hibák
 */
const ProductCategoryGroupErrors = {
  notFound: () => createStructuredError(ERROR_CODES.PRODUCT_CATEGORY_GROUP.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_CATEGORY_GROUP.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_CATEGORY_GROUP.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_CATEGORY_GROUP.DELETE_FAILED, details),
};

/**
 * Product Category hibák
 */
const ProductCategoryErrors = {
  notFound: () => createStructuredError(ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_CATEGORY.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_CATEGORY.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED, details),
};

/**
 * Product Subcategory hibák
 */
const ProductSubcategoryErrors = {
  notFound: () => createStructuredError(ERROR_CODES.PRODUCT_SUBCATEGORY.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_SUBCATEGORY.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_SUBCATEGORY.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT_SUBCATEGORY.DELETE_FAILED, details),
};

/**
 * Product hibák
 */
const ProductErrors = {
  notFound: () => createStructuredError(ERROR_CODES.PRODUCT.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.PRODUCT.DELETE_FAILED, details),
};

/**
 * Reference hibák
 */
const ReferenceErrors = {
  notFound: () => createStructuredError(ERROR_CODES.REFERENCE.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.REFERENCE.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.REFERENCE.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.REFERENCE.DELETE_FAILED, details),
};

/**
 * Media hibák
 */
const MediaErrors = {
  notFound: () => createStructuredError(ERROR_CODES.MEDIA.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.MEDIA.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.MEDIA.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.MEDIA.DELETE_FAILED, details),
};

/**
 * Partner hibák
 */
const PartnerErrors = {
  notFound: () => createStructuredError(ERROR_CODES.PARTNER.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.PARTNER.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.PARTNER.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.PARTNER.DELETE_FAILED, details),
};

/**
 * DownloadableItem hibák
 */
const DownloadableItemErrors = {
  notFound: () => createStructuredError(ERROR_CODES.DOWNLOADABLE_ITEM.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.DOWNLOADABLE_ITEM.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.DOWNLOADABLE_ITEM.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.DOWNLOADABLE_ITEM.DELETE_FAILED, details),
};

/**
 * DownloadableCategory hibák
 */
const DownloadableCategoryErrors = {
  notFound: () => createStructuredError(ERROR_CODES.DOWNLOADABLE_CATEGORY.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.DOWNLOADABLE_CATEGORY.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.DOWNLOADABLE_CATEGORY.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.DOWNLOADABLE_CATEGORY.DELETE_FAILED, details),
};

/**
 * InternationalContact hibák
 */
const InternationalContactErrors = {
  notFound: () => createStructuredError(ERROR_CODES.INTERNATIONAL_CONTACT.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.INTERNATIONAL_CONTACT.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.INTERNATIONAL_CONTACT.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.INTERNATIONAL_CONTACT.DELETE_FAILED, details),
};

/**
 * Glossary hibák
 */
const GlossaryErrors = {
  notFound: () => createStructuredError(ERROR_CODES.GLOSSARY.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.GLOSSARY.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.GLOSSARY.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.GLOSSARY.DELETE_FAILED, details),
};

/**
 * Legal doc hibák
 */
const LegalDocErrors = {
  notFound: () => createStructuredError(ERROR_CODES.LEGAL_DOC.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.LEGAL_DOC.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.LEGAL_DOC.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.LEGAL_DOC.DELETE_FAILED, details),
};

/**
 * Social media page hibák
 */
const SocialMediaPageErrors = {
  notFound: () => createStructuredError(ERROR_CODES.SOCIAL_MEDIA_PAGE.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.SOCIAL_MEDIA_PAGE.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.SOCIAL_MEDIA_PAGE.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.SOCIAL_MEDIA_PAGE.DELETE_FAILED, details),
};

/**
 * Email verifikáció hibák
 */
const EmailVerificationErrors = {
  tokenExpired: () =>
    createStructuredError(ERROR_CODES.EMAIL_VERIFICATION.TOKEN_EXPIRED),
  tokenInvalid: () =>
    createStructuredError(ERROR_CODES.EMAIL_VERIFICATION.TOKEN_INVALID),
  alreadyVerified: () =>
    createStructuredError(ERROR_CODES.EMAIL_VERIFICATION.ALREADY_VERIFIED),
  sendFailed: (details) =>
    createStructuredError(ERROR_CODES.EMAIL_VERIFICATION.SEND_FAILED, details),
};

/**
 * Password reset hibák
 */
const PasswordResetErrors = {
  tokenExpired: () =>
    createStructuredError(ERROR_CODES.PASSWORD_RESET.TOKEN_EXPIRED),
  tokenInvalid: () =>
    createStructuredError(ERROR_CODES.PASSWORD_RESET.TOKEN_INVALID),
  userNotFound: () => createStructuredError(ERROR_CODES.USER.NOT_FOUND),
  submitFailed: (details) =>
    createStructuredError(ERROR_CODES.PASSWORD_RESET.SUBMIT_FAILED, details),
  requestFailed: (details) =>
    createStructuredError(ERROR_CODES.PASSWORD_RESET.REQUEST_FAILED, details),
};

/**
 * Contact hibák
 */
const ContactErrors = {
  notFound: () => createStructuredError(ERROR_CODES.CONTACT.NOT_FOUND),
  createFailed: (details) =>
    createStructuredError(ERROR_CODES.CONTACT.CREATE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.CONTACT.UPDATE_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.CONTACT.DELETE_FAILED, details),
  emailSendFailed: (details) =>
    createStructuredError(ERROR_CODES.CONTACT.EMAIL_SEND_FAILED, details),
};

/**
 * File hibák
 */
const FileErrors = {
  notFound: () => createStructuredError(ERROR_CODES.FILE.NOT_FOUND),
  invalidFile: () => createStructuredError(ERROR_CODES.FILE.INVALID_FILE),
  uploadFailed: (details) =>
    createStructuredError(ERROR_CODES.FILE.UPLOAD_FAILED, details),
  deleteFailed: (details) =>
    createStructuredError(ERROR_CODES.FILE.DELETE_FAILED, details),
  updateFailed: (details) =>
    createStructuredError(ERROR_CODES.FILE.UPDATE_FAILED, details),
  fileTooLarge: () => createStructuredError(ERROR_CODES.FILE.FILE_TOO_LARGE),
  invalidFileType: () =>
    createStructuredError(ERROR_CODES.FILE.INVALID_FILE_TYPE),
};

/**
 * Auth hibák
 */
const AuthErrors = {
  invalidCredentials: () =>
    createStructuredError(ERROR_CODES.AUTH.INVALID_CREDENTIALS),
  userNotFound: () => createStructuredError(ERROR_CODES.AUTH.USER_NOT_FOUND),
  userInactive: () => createStructuredError(ERROR_CODES.AUTH.USER_INACTIVE),
  emailNotVerified: () =>
    createStructuredError(ERROR_CODES.AUTH.EMAIL_NOT_VERIFIED),
  insufficientPermissions: () =>
    createStructuredError(ERROR_CODES.AUTH.INSUFFICIENT_PERMISSIONS),
  jwtExpired: () => createStructuredError(ERROR_CODES.AUTH.JWT_EXPIRED),
  jwtMissing: () => createStructuredError(ERROR_CODES.AUTH.JWT_MISSING),
  refreshTokenExpired: () =>
    createStructuredError(ERROR_CODES.AUTH.REFRESH_TOKEN_EXPIRED),
};

/**
 * Default error messages minden error kódhoz
 */

/**
 * Egyszerűsített handleError függvény
 * @param {Response} res - Express response objektum
 * @param {Error} error - Dobott error
 * @param {string} errorCode - Error kód (pl. ERROR_CODES.USER.NOT_FOUND)
 * @returns {void}
 */
function handleError(res, error, errorCode) {
  if (error && error.isStructured) {
    return errorResponse(res, error.message, error.code);
  } else {
    const defaultMessage = getErrorMessage(errorCode);
    const errorDetails = error?.message ?? (error != null ? String(error) : null);
    return errorResponse(res, defaultMessage, errorCode, true, 400, errorDetails);
  }
}

module.exports = {
  createError,
  UserErrors,
  FAQErrors,
  FAQCategoryErrors,
  SubscriberErrors,
  TestimonialErrors,
  HeroSliderErrors,
  ProductCategoryGroupErrors,
  ProductCategoryErrors,
  ProductSubcategoryErrors,
  ProductErrors,
  ReferenceErrors,
  MediaErrors,
  PartnerErrors,
  DownloadableItemErrors,
  DownloadableCategoryErrors,
  InternationalContactErrors,
  GlossaryErrors,
  LegalDocErrors,
  SocialMediaPageErrors,
  EmailVerificationErrors,
  PasswordResetErrors,
  ContactErrors,
  FileErrors,
  AuthErrors,
  handleError,
  getErrorMessage,
};
