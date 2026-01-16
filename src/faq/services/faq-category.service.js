const FaqCategory = require("../models/faq-category.model");
const Faq = require("../models/faq.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const { FAQCategoryErrors } = require("../../shared/response-helpers/error-helper");

class FaqCategoryService {
  async createFaqCategory(categoryData) {
    const category = await FaqCategory.create(categoryData);
    return await this.getFaqCategoryById(category.id);
  }

  async getAllFaqCategories() {
    const categories = await FaqCategory.findAll({
      order: [["displayOrder", "ASC"]],
      include: [
        {
          model: Faq,
          as: "faqs",
          required: false,
        },
      ],
    });

    return categories;
  }

  async getPublishedFaqCategories() {
    const categories = await FaqCategory.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
      include: [
        {
          model: Faq,
          as: "faqs",
          where: { status: "PUBLISHED" },
          order: [["displayOrder", "ASC"]],
        },
      ],
    });

    return categories;
  }

  async getFaqCategoryById(id) {
    const category = await FaqCategory.findOne({
      where: { id },
      include: [
        {
          model: Faq,
          as: "faqs",
          required: false,
        },
      ],
    });

    return category;
  }

  async updateFaqCategory(id, categoryData) {
    const category = await FaqCategory.findOne({
      where: { id },
    });

    if (!category) {
      throw FAQCategoryErrors.notFound();
    }

    await category.update(categoryData);
    return this.getFaqCategoryById(id);
  }

  async deleteFaqCategory(id) {
    const category = await FaqCategory.findOne({
      where: { id },
    });

    if (!category) {
      throw FAQCategoryErrors.notFound();
    }

    await category.destroy();
    return true;
  }

  async queryFaqCategories({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: FaqCategory,
      pagination,
      sort,
      search,
      filters,
      include: [
        {
          model: Faq,
          as: "faqs",
          required: false,
        },
      ],
    });

    return result;
  }

  async updateFaqCategoryStatus(ids, status) {
    await FaqCategory.update({ status }, { where: { id: ids } });

    const updatedCategories = await FaqCategory.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: Faq,
          as: "faqs",
          required: false,
        },
      ],
    });

    return updatedCategories;
  }
}

module.exports = new FaqCategoryService();
