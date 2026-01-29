const Reference = require("../models/reference.model");
const ReferenceResult = require("../models/reference-result.model");
const ReferenceTestimonial = require("../models/reference-testimonial.model");
const Media = require("../../media/models/media.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  ReferenceErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const { customSlugify } = require("../../shared/database-helpers/slugify-helper");

function normalizeCountries(val) {
  if (val == null) return [];
  if (Array.isArray(val)) return val.map((c) => String(c));
  return [String(val)];
}

function ensureCountriesArray(ref) {
  if (!ref) return ref;
  let c = ref.countries;
  if (typeof c === "string") {
    try {
      c = JSON.parse(c);
    } catch {
      c = [];
    }
  }
  ref.countries = Array.isArray(c) ? c.map((x) => String(x)) : [];
  return ref;
}

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

    // Külön kezeljük a results, testimonials, media és relatedReferences adatokat
    const { results, testimonials, media, relatedReferences, ...referenceFields } = referenceData;

    referenceFields.countries = normalizeCountries(referenceFields.countries);

    const reference = await Reference.create(referenceFields);

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

    // Ha van media, hozzáadjuk (many-to-many, related media)
    if (media && Array.isArray(media) && media.length > 0) {
      await reference.setMedia(media);
    }

    // Ha van relatedReferences, hozzáadjuk (many-to-many, self-referential)
    if (relatedReferences && Array.isArray(relatedReferences) && relatedReferences.length > 0) {
      await reference.setRelatedReferences(relatedReferences);
    }

    return await this.getReferenceById(reference.id);
  }

  async getAllReferences() {
    const references = await Reference.findAll({
      order: [["createdAt", "DESC"]],
      include: [
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
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Reference,
          as: "relatedReferences",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a mediaId-kat és relatedReferenceId-kat adjuk vissza tömbben
    return references.map((reference) => {
      const referenceJson = reference.toJSON();
      referenceJson.mediaIds = referenceJson.media
        ? referenceJson.media.map((m) => m.id)
        : [];
      referenceJson.relatedReferenceIds = referenceJson.relatedReferences
        ? referenceJson.relatedReferences.map((rr) => rr.id)
        : [];
      delete referenceJson.media;
      delete referenceJson.relatedReferences;
      return ensureCountriesArray(referenceJson);
    });
  }

  async getPublishedReferences() {
    const references = await Reference.findAll({
      where: { status: "PUBLISHED" },
      order: [["createdAt", "DESC"]],
      include: [
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
        {
          model: Media,
          as: "media",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
        },
        {
          model: Reference,
          as: "relatedReferences",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
        },
      ],
    });
    return references.map((r) => ensureCountriesArray(r.toJSON()));
  }

  async getReferenceById(id, includeAdjacent = false) {
    const reference = await Reference.findOne({
      where: { id },
      include: [
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
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Reference,
          as: "relatedReferences",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    if (!reference) {
      return null;
    }

    // Admin esetén csak a mediaId-kat és relatedReferenceId-kat adjuk vissza tömbben
    const referenceJson = reference.toJSON();
    referenceJson.mediaIds = referenceJson.media
      ? referenceJson.media.map((m) => m.id)
      : [];
    referenceJson.relatedReferenceIds = referenceJson.relatedReferences
      ? referenceJson.relatedReferences.map((rr) => rr.id)
      : [];
    delete referenceJson.media;
    delete referenceJson.relatedReferences;
    ensureCountriesArray(referenceJson);

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Reference,
          orderBy: "createdAt",
        });

        return {
          ...referenceJson,
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return referenceJson;
      }
    }

    return referenceJson;
  }

  async getReferenceBySlug(slug) {
    const reference = await Reference.findOne({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: [
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
        {
          model: Media,
          as: "media",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
        },
        {
          model: Reference,
          as: "relatedReferences",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
        },
      ],
    });

    if (!reference) return null;
    const refJson = reference.toJSON();
    return ensureCountriesArray(refJson);
  }

  async updateReference(id, referenceData) {
    const reference = await Reference.findOne({
      where: { id },
    });

    if (!reference) {
      throw ReferenceErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    const slugEmpty = referenceData.slug == null || String(referenceData.slug).trim() === "";
    if (slugEmpty && referenceData.title) {
      referenceData.slug = await customSlugify(
        Reference,
        referenceData.title,
        id
      );
    }

    // Külön kezeljük a results, testimonials, media és relatedReferences adatokat
    const { results, testimonials, media, relatedReferences, ...referenceFields } = referenceData;

    // Ne frissítsük a primary key-t (a body-ban jöhet id)
    delete referenceFields.id;

    if (referenceFields.countries !== undefined) {
      referenceFields.countries = normalizeCountries(referenceFields.countries);
    }

    await reference.update(referenceFields);

    // Ha van results, frissítjük (töröljük a régit és létrehozzuk az újat)
    if (results !== undefined) {
      await ReferenceResult.destroy({ where: { referenceId: id } });
      if (Array.isArray(results) && results.length > 0) {
        const resultItems = results.map((item) => {
          const { id: _id, ...rest } = item;
          return { ...rest, referenceId: id };
        });
        await ReferenceResult.bulkCreate(resultItems);
      }
    }

    // Ha van testimonials, frissítjük (töröljük a régit és létrehozzuk az újat)
    if (testimonials !== undefined) {
      await ReferenceTestimonial.destroy({ where: { referenceId: id } });
      if (Array.isArray(testimonials) && testimonials.length > 0) {
        const testimonialItems = testimonials.map((item) => {
          const { id: _id, ...rest } = item;
          return { ...rest, referenceId: id };
        });
        await ReferenceTestimonial.bulkCreate(testimonialItems);
      }
    }

    // Ha van media, frissítjük (many-to-many, related media)
    if (media !== undefined) {
      if (Array.isArray(media) && media.length > 0) {
        await reference.setMedia(media);
      } else {
        await reference.setMedia([]);
      }
    }

    // Ha van relatedReferences, frissítjük (many-to-many, self-referential)
    if (relatedReferences !== undefined) {
      if (Array.isArray(relatedReferences) && relatedReferences.length > 0) {
        await reference.setRelatedReferences(relatedReferences);
      } else {
        await reference.setRelatedReferences([]);
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
          model: ReferenceResult,
          as: "results",
          required: false,
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
        },
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Reference,
          as: "relatedReferences",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a mediaId-kat és relatedReferenceId-kat adjuk vissza tömbben
    if (result.data) {
      result.data = result.data.map((reference) => {
        const referenceJson = reference.toJSON ? reference.toJSON() : reference;
        referenceJson.mediaIds = referenceJson.media
          ? referenceJson.media.map((m) => m.id)
          : [];
        referenceJson.relatedReferenceIds = referenceJson.relatedReferences
          ? referenceJson.relatedReferences.map((rr) => rr.id)
          : [];
        delete referenceJson.media;
        delete referenceJson.relatedReferences;
        return ensureCountriesArray(referenceJson);
      });
    }

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
          model: ReferenceResult,
          as: "results",
          required: false,
        },
        {
          model: ReferenceTestimonial,
          as: "testimonials",
          required: false,
        },
        {
          model: Media,
          as: "media",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
        {
          model: Reference,
          as: "relatedReferences",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a mediaId-kat és relatedReferenceId-kat adjuk vissza tömbben
    return updatedReferences.map((reference) => {
      const referenceJson = reference.toJSON();
      referenceJson.mediaIds = referenceJson.media
        ? referenceJson.media.map((m) => m.id)
        : [];
      referenceJson.relatedReferenceIds = referenceJson.relatedReferences
        ? referenceJson.relatedReferences.map((rr) => rr.id)
        : [];
      delete referenceJson.media;
      delete referenceJson.relatedReferences;
      return ensureCountriesArray(referenceJson);
    });
  }
}

module.exports = new ReferenceService();
