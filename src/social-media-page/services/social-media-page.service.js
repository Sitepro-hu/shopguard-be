const SocialMediaPage = require("../models/social-media-page.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  SocialMediaPageErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class SocialMediaPageService {
  async createSocialMediaPage(data) {
    const page = await SocialMediaPage.create(data);
    return await this.getSocialMediaPageById(page.id);
  }

  async getAllSocialMediaPages() {
    return await SocialMediaPage.findAll({
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
  }

  async getPublishedSocialMediaPages() {
    return await SocialMediaPage.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
  }

  async getSocialMediaPageById(id, includeAdjacent = false) {
    const page = await SocialMediaPage.findOne({ where: { id } });
    if (!page) return null;

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id,
          model: SocialMediaPage,
          orderBy: "displayOrder",
        });
        return {
          ...page.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch {
        return page;
      }
    }
    return page;
  }

  async updateSocialMediaPage(id, data) {
    const page = await SocialMediaPage.findOne({ where: { id } });
    if (!page) throw SocialMediaPageErrors.notFound();
    delete data.id;
    await page.update(data);
    return await this.getSocialMediaPageById(id);
  }

  async deleteSocialMediaPage(id) {
    const page = await SocialMediaPage.findOne({ where: { id } });
    if (!page) throw SocialMediaPageErrors.notFound();
    await page.destroy();
    return true;
  }

  async querySocialMediaPages({ pagination, sort, search, filters }) {
    return await queryDatabase({
      model: SocialMediaPage,
      pagination,
      sort,
      search,
      filters,
    });
  }

  async updateSocialMediaPageStatus(ids, status) {
    await SocialMediaPage.update({ status }, { where: { id: ids } });
    return await SocialMediaPage.findAll({
      where: { id: ids },
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
  }
}

module.exports = new SocialMediaPageService();
