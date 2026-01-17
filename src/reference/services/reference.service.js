const Reference = require("../models/reference.model");
const Country = require("../models/country.model");
const ReferenceResult = require("../models/reference-result.model");
const ReferenceTestimonial = require("../models/reference-testimonial.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  ReferenceErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const { customSlugify } = require("../../shared/database-helpers/slugify-helper");

class ReferenceService {
  async createReference(referenceData) {
    // Ha nincs slug vagy üres, generáljuk a title-ből
    if (!referenceData.slug || referenceData.slug.trim() === "") {
      referenceData.slug = await customSlugify(
        Reference,
        referenceData.title,
        null
      );
    }

    // Külön kezeljük a countries, results és testimonials adatokat
    const { countries, results, testimonials, ...referenceFields } = referenceData;

    const reference = await Reference.create(referenceFields);

    // Ha van countries, hozzáadjuk (many-to-many)
    if (countries && Array.isArray(countries) && countries.length > 0) {
      await reference.setCountries(countries);
    }

    // Ha van results, hozzáadjuk
    if (results && Array.isArray(results)) {
      const resultItems = results.map((item) => ({
        ...item,
        referenceId: reference.id,
      }));
      await ReferenceResult.bulkCreate(resultItems);
    }

    // Ha van testimonials, hozzáadjuk
    if (testimonials && Array.isArray(testimonials)) {
      const testimonialItems = testimonials.map((item) => ({
        ...item,
        referenceId: reference.id,
      }));
      await ReferenceTestimonial.bulkCreate(testimonialItems);
    }

    return await this.getReferenceById(reference.id);
  }

  async getAllReferences() {
    return await Reference.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Country,
          as: "countries",
          required: false,
          through: { attributes: [] },
        },
        {
          model: ReferenceResult,
          as: "results",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
      ],
    });
  }

  async getPublishedReferences() {
    return await Reference.findAll({
      where: { status: "PUBLISHED" },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Country,
          as: "countries",
          required: false,
          through: { attributes: [] },
        },
        {
          model: ReferenceResult,
          as: "results",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
      ],
    });
  }

  async getReferenceById(id, includeAdjacent = false) {
    const reference = await Reference.findOne({
      where: { id },
      include: [
        {
          model: Country,
          as: "countries",
          required: false,
          through: { attributes: [] },
        },
        {
          model: ReferenceResult,
          as: "results",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
      ],
    });

    if (!reference) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Reference,
          orderBy: "createdAt",
        });

        return {
          ...reference.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return reference;
      }
    }

    return reference;
  }

  async getReferenceBySlug(slug) {
    const reference = await Reference.findOne({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: [
        {
          model: Country,
          as: "countries",
          required: false,
          through: { attributes: [] },
        },
        {
          model: ReferenceResult,
          as: "results",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
      ],
    });

    return reference;
  }

  async updateReference(id, referenceData) {
    const reference = await Reference.findOne({
      where: { id },
    });

    if (!reference) {
      throw ReferenceErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    if (
      (!referenceData.slug || referenceData.slug.trim() === "") &&
      referenceData.title
    ) {
      referenceData.slug = await customSlugify(
        Reference,
        referenceData.title,
        id
      );
    }

    // Külön kezeljük a countries, results és testimonials adatokat
    const { countries, results, testimonials, ...referenceFields } = referenceData;

    await reference.update(referenceFields);

    // Ha van countries, frissítjük
    if (countries !== undefined) {
      if (Array.isArray(countries) && countries.length > 0) {
        await reference.setCountries(countries);
      } else {
        await reference.setCountries([]);
      }
    }

    // Ha van results, frissítjük (töröljük a régit és létrehozzuk az újat)
    if (results !== undefined) {
      await ReferenceResult.destroy({ where: { referenceId: id } });
      if (Array.isArray(results) && results.length > 0) {
        const resultItems = results.map((item) => ({
          ...item,
          referenceId: id,
        }));
        await ReferenceResult.bulkCreate(resultItems);
      }
    }

    // Ha van testimonials, frissítjük (töröljük a régit és létrehozzuk az újat)
    if (testimonials !== undefined) {
      await ReferenceTestimonial.destroy({ where: { referenceId: id } });
      if (Array.isArray(testimonials) && testimonials.length > 0) {
        const testimonialItems = testimonials.map((item) => ({
          ...item,
          referenceId: id,
        }));
        await ReferenceTestimonial.bulkCreate(testimonialItems);
      }
    }

    return await this.getReferenceById(id);
  }

  async deleteReference(id) {
    const reference = await Reference.findOne({
      where: { id },
    });

    if (!reference) {
      throw ReferenceErrors.notFound();
    }

    await reference.destroy();

    return true;
  }

  async queryReferences({ pagination, sort, search, filters, publishedOnly = false }) {
    const queryFilters = publishedOnly 
      ? { ...filters, status: "PUBLISHED" }
      : filters;

    const result = await queryDatabase({
      model: Reference,
      pagination,
      sort,
      search,
      filters: queryFilters,
      include: [
        {
          model: Country,
          as: "countries",
          required: false,
          through: { attributes: [] },
        },
        {
          model: ReferenceResult,
          as: "results",
          required: false,
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
        },
      ],
    });

    return result;
  }

  async updateReferenceStatus(ids, status) {
    await Reference.update({ status }, { where: { id: ids } });

    const updatedReferences = await Reference.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: Country,
          as: "countries",
          required: false,
          through: { attributes: [] },
        },
        {
          model: ReferenceResult,
          as: "results",
          required: false,
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
        },
      ],
    });

    return updatedReferences;
  }
}

module.exports = new ReferenceService();
