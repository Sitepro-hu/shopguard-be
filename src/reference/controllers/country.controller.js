const countryService = require("../services/country.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  CountryErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class CountryController {
  async createCountry(req, res) {
    try {
      const country = await countryService.createCountry(req.body);
      handleSuccess(res, SUCCESS_CODES.COUNTRY.CREATE_SUCCESS, country);
    } catch (error) {
      handleError(res, error, ERROR_CODES.COUNTRY.CREATE_FAILED);
    }
  }

  async getAllCountries(req, res) {
    try {
      const countries = await countryService.getAllCountries();
      handleSuccess(res, SUCCESS_CODES.COUNTRY.QUERY_SUCCESS, countries);
    } catch (error) {
      handleError(res, error, ERROR_CODES.COUNTRY.QUERY_FAILED);
    }
  }

  async getCountryById(req, res) {
    try {
      const country = await countryService.getCountryById(
        req.params.id,
        true
      );
      if (!country) {
        throw CountryErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.COUNTRY.QUERY_SUCCESS, country);
    } catch (error) {
      handleError(res, error, ERROR_CODES.COUNTRY.QUERY_FAILED);
    }
  }

  async queryCountries(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await countryService.queryCountries({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.COUNTRY.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.COUNTRY.QUERY_FAILED);
    }
  }

  async updateCountry(req, res) {
    try {
      const country = await countryService.updateCountry(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.COUNTRY.UPDATE_SUCCESS, country);
    } catch (error) {
      handleError(res, error, ERROR_CODES.COUNTRY.UPDATE_FAILED);
    }
  }

  async deleteCountry(req, res) {
    try {
      await countryService.deleteCountry(req.params.id);
      handleSuccess(res, SUCCESS_CODES.COUNTRY.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.COUNTRY.DELETE_FAILED);
    }
  }
}

module.exports = new CountryController();
