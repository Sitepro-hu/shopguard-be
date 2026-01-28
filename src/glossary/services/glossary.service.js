const Glossary = require("../models/glossary.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  GlossaryErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class GlossaryService {
  async createGlossary(glossaryData) {
    const glossary = await Glossary.create(glossaryData);
    return await this.getGlossaryById(glossary.id);
  }

  async getAllGlossaries() {
    return await Glossary.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedGlossaries() {
    return await Glossary.findAll({
      where: { status: "PUBLISHED" },
      order: [["name", "ASC"]],
    });
  }

  async getGlossaryById(id, includeAdjacent = false) {
    const glossary = await Glossary.findOne({ where: { id } });

    if (!glossary) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Glossary,
          orderBy: "createdAt"
        });

        return {
          ...glossary.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a glossary-t adjuk vissza
        return glossary;
      }
    }

    return glossary;
  }

  async updateGlossary(id, glossaryData) {
    const glossary = await Glossary.findOne({
      where: { id },
    });

    if (!glossary) {
      throw GlossaryErrors.notFound();
    }

    await glossary.update(glossaryData);

    return await this.getGlossaryById(id);
  }

  async deleteGlossary(id) {
    const glossary = await Glossary.findOne({
      where: { id },
    });

    if (!glossary) {
      throw GlossaryErrors.notFound();
    }

    await glossary.destroy();

    return true;
  }

  async queryGlossaries({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: Glossary,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateGlossaryStatus(ids, status) {
    await Glossary.update({ status }, { where: { id: ids } });

    const updatedGlossaries = await Glossary.findAll({
      where: {
        id: ids,
      },
    });

    return updatedGlossaries;
  }
}

module.exports = new GlossaryService();
