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

    const media = await Media.create(mediaData);
    return await this.getMediaById(media.id);
  }

  async getAllMedia() {
    return await Media.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedMedia() {
    return await Media.findAll({
      where: { status: "PUBLISHED" },
      order: [["createdAt", "DESC"]],
    });
  }

  async getMediaById(id, includeAdjacent = false) {
    const media = await Media.findOne({
      where: { id },
    });

    if (!media) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Media,
          orderBy: "createdAt",
        });

        return {
          ...media.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return media;
      }
    }

    return media;
  }

  async getMediaBySlug(slug) {
    const media = await Media.findOne({
      where: {
        slug,
        status: "PUBLISHED",
      },
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

    await media.update(mediaData);

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
    });

    return result;
  }

  async updateMediaStatus(ids, status) {
    await Media.update({ status }, { where: { id: ids } });

    const updatedMedia = await Media.findAll({
      where: {
        id: ids,
      },
    });

    return updatedMedia;
  }
}

module.exports = new MediaService();
