const Country = require("../models/country.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  CountryErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class CountryService {
  async createCountry(countryData) {
    const country = await Country.create(countryData);
    return await this.getCountryById(country.id);
  }

  async getAllCountries() {
    return await Country.findAll({
      order: [["name", "ASC"]],
    });
  }

  async getCountryById(id, includeAdjacent = false) {
    const country = await Country.findOne({
      where: { id },
    });

    if (!country) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Country,
          orderBy: "name",
        });

        return {
          ...country.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return country;
      }
    }

    return country;
  }

  async updateCountry(id, countryData) {
    const country = await Country.findOne({
      where: { id },
    });

    if (!country) {
      throw CountryErrors.notFound();
    }

    await country.update(countryData);

    return await this.getCountryById(id);
  }

  async deleteCountry(id) {
    const country = await Country.findOne({
      where: { id },
    });

    if (!country) {
      throw CountryErrors.notFound();
    }

    await country.destroy();

    return true;
  }

  async queryCountries({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: Country,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }
}

module.exports = new CountryService();
