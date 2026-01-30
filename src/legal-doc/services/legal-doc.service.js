const LegalDoc = require("../models/legal-doc.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  LegalDocErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");
const { customSlugify } = require("../../shared/database-helpers/slugify-helper");

class LegalDocService {
  async createLegalDoc(data) {
    if (!data.slug || String(data.slug).trim() === "") {
      data.slug = await customSlugify(LegalDoc, data.title, null);
    }
    const doc = await LegalDoc.create(data);
    return await this.getLegalDocById(doc.id);
  }

  async getAllLegalDocs() {
    return await LegalDoc.findAll({
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
  }

  async getPublishedLegalDocs() {
    return await LegalDoc.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
  }

  async getLegalDocById(id, includeAdjacent = false) {
    const doc = await LegalDoc.findOne({ where: { id } });
    if (!doc) return null;

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id,
          model: LegalDoc,
          orderBy: "displayOrder",
        });
        return {
          ...doc.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch {
        return doc;
      }
    }
    return doc;
  }

  async getLegalDocBySlug(slug) {
    const doc = await LegalDoc.findOne({
      where: { slug, status: "PUBLISHED" },
    });
    return doc ? doc.toJSON() : null;
  }

  async updateLegalDoc(id, data) {
    const doc = await LegalDoc.findOne({ where: { id } });
    if (!doc) throw LegalDocErrors.notFound();

    const slugEmpty = data.slug == null || String(data.slug).trim() === "";
    if (slugEmpty && data.title) {
      data.slug = await customSlugify(LegalDoc, data.title, id);
    }
    delete data.id;
    await doc.update(data);
    return await this.getLegalDocById(id);
  }

  async deleteLegalDoc(id) {
    const doc = await LegalDoc.findOne({ where: { id } });
    if (!doc) throw LegalDocErrors.notFound();
    await doc.destroy();
    return true;
  }

  async queryLegalDocs({ pagination, sort, search, filters }) {
    return await queryDatabase({
      model: LegalDoc,
      pagination,
      sort,
      search,
      filters,
    });
  }

  async updateLegalDocStatus(ids, status) {
    await LegalDoc.update({ status }, { where: { id: ids } });
    return await LegalDoc.findAll({
      where: { id: ids },
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
  }
}

module.exports = new LegalDocService();
