const Media = require("../models/media.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  MediaErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const { customSlugify } = require("../../shared/database-helpers/slugify-helper");

class MediaService {
  async createMedia(mediaData) {
    // Ha nincs slug vagy üres, generáljuk a title-ből
    if (!mediaData.slug || mediaData.slug.trim() === "") {
      mediaData.slug = await customSlugify(
        Media,
        mediaData.title,
        null
      );
    }

    // Külön kezeljük a relatedMedia adatokat
    const { relatedMedia, ...mediaFields } = mediaData;

    const media = await Media.create(mediaFields);

    // Ha van relatedMedia, hozzáadjuk (many-to-many, self-referential)
    if (relatedMedia && Array.isArray(relatedMedia) && relatedMedia.length > 0) {
      await media.setRelatedMedia(relatedMedia);
    }

    return await this.getMediaById(media.id);
  }

  async getAllMedia() {
    const mediaList = await Media.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Media,
          as: "relatedMedia",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a relatedMediaId-kat adjuk vissza tömbben
    return mediaList.map((media) => {
      const mediaJson = media.toJSON();
      mediaJson.relatedMediaIds = mediaJson.relatedMedia
        ? mediaJson.relatedMedia.map((rm) => rm.id)
        : [];
      delete mediaJson.relatedMedia;
      return mediaJson;
    });
  }

  async getPublishedMedia() {
    return await Media.findAll({
      where: { status: "PUBLISHED" },
      order: [["isPinned", "DESC"], ["createdAt", "DESC"]],
      include: [
        {
          model: Media,
          as: "relatedMedia",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
        },
      ],
    });
  }

  async getMediaById(id, includeAdjacent = false) {
    const media = await Media.findOne({
      where: { id },
      include: [
        {
          model: Media,
          as: "relatedMedia",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    if (!media) {
      return null;
    }

    // Admin esetén csak a relatedMediaId-kat adjuk vissza tömbben
    const mediaJson = media.toJSON();
    mediaJson.relatedMediaIds = mediaJson.relatedMedia
      ? mediaJson.relatedMedia.map((rm) => rm.id)
      : [];
    delete mediaJson.relatedMedia;

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Media,
          orderBy: "createdAt",
        });

        return {
          ...mediaJson,
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return mediaJson;
      }
    }

    return mediaJson;
  }

  async getMediaBySlug(slug) {
    const media = await Media.findOne({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: [
        {
          model: Media,
          as: "relatedMedia",
          required: false,
          where: { status: "PUBLISHED" },
          through: { attributes: [] },
        },
      ],
    });

    return media;
  }

  async updateMedia(id, mediaData) {
    const media = await Media.findOne({
      where: { id },
    });

    if (!media) {
      throw MediaErrors.notFound();
    }

    // Ha nincs slug vagy üres, és változott a title, generáljuk a title-ből
    if (
      (!mediaData.slug || mediaData.slug.trim() === "") &&
      mediaData.title
    ) {
      mediaData.slug = await customSlugify(
        Media,
        mediaData.title,
        id
      );
    }

    // Külön kezeljük a relatedMedia adatokat
    const { relatedMedia, ...mediaFields } = mediaData;

    await media.update(mediaFields);

    // Ha van relatedMedia, frissítjük (many-to-many, self-referential)
    if (relatedMedia !== undefined) {
      if (Array.isArray(relatedMedia) && relatedMedia.length > 0) {
        await media.setRelatedMedia(relatedMedia);
      } else {
        await media.setRelatedMedia([]);
      }
    }

    return await this.getMediaById(id);
  }

  async deleteMedia(id) {
    const media = await Media.findOne({
      where: { id },
    });

    if (!media) {
      throw MediaErrors.notFound();
    }

    await media.destroy();

    return true;
  }

  async queryMedia({ pagination, sort, search, filters, publishedOnly = false }) {
    const queryFilters = publishedOnly 
      ? { ...filters, status: "PUBLISHED" }
      : filters;

    const result = await queryDatabase({
      model: Media,
      pagination,
      sort,
      search,
      filters: queryFilters,
      include: [
        {
          model: Media,
          as: "relatedMedia",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a relatedMediaId-kat adjuk vissza tömbben
    if (result.data) {
      result.data = result.data.map((media) => {
        const mediaJson = media.toJSON ? media.toJSON() : media;
        mediaJson.relatedMediaIds = mediaJson.relatedMedia
          ? mediaJson.relatedMedia.map((rm) => rm.id)
          : [];
        delete mediaJson.relatedMedia;
        return mediaJson;
      });
    }

    return result;
  }

  async updateMediaStatus(ids, status) {
    await Media.update({ status }, { where: { id: ids } });

    const updatedMedia = await Media.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: Media,
          as: "relatedMedia",
          required: false,
          through: { attributes: [] },
          attributes: ["id"], // Admin esetén csak az ID-kat adjuk vissza
        },
      ],
    });

    // Admin esetén csak a relatedMediaId-kat adjuk vissza tömbben
    return updatedMedia.map((media) => {
      const mediaJson = media.toJSON();
      mediaJson.relatedMediaIds = mediaJson.relatedMedia
        ? mediaJson.relatedMedia.map((rm) => rm.id)
        : [];
      delete mediaJson.relatedMedia;
      return mediaJson;
    });
  }
}

module.exports = new MediaService();
