const FAQ = require("../models/faq.model");
const FaqCategory = require("../models/faq-category.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const { FAQErrors } = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class FAQService {
  async createFAQ(faqData) {
    const faq = await FAQ.create(faqData);
    return await this.getFAQById(faq.id);
  }

  async getAllFAQs() {
    return await FAQ.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: FaqCategory,
          as: "category",
        },
      ],
    });
  }

  async getPublishedFAQs() {
    return await FAQ.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
    });
  }

  async getFAQById(id, includeAdjacent = false) {
    const faq = await FAQ.findOne({
      where: { id },
      include: [
        {
          model: FaqCategory,
          as: "category",
        },
      ],
    });

    if (!faq) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: FAQ,
          orderBy: "createdAt"
        });

        return {
          ...faq.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a FAQ-t adjuk vissza
        return faq;
      }
    }

    return faq;
  }

  async updateFAQ(id, faqData) {
    const faq = await FAQ.findOne({
      where: { id },
    });

    if (!faq) {
      throw FAQErrors.notFound();
    }

    await faq.update(faqData);
    return await this.getFAQById(id);
  }

  async deleteFAQ(id) {
    const faq = await FAQ.findOne({
      where: { id },
    });

    if (!faq) {
      throw FAQErrors.notFound();
    }

    await faq.destroy();
    return true;
  }

  async queryFAQs({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: FAQ,
      pagination,
      sort,
      search,
      filters,
      include: [
        {
          model: FaqCategory,
          as: "category",
        },
      ],
    });

    return result;
  }

  async updateFAQsStatus(ids, status) {
    await FAQ.update({ status }, { where: { id: ids } });

    const updatedFAQs = await FAQ.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: FaqCategory,
          as: "category",
        },
      ],
    });

    return updatedFAQs;
  }
}

module.exports = new FAQService();
