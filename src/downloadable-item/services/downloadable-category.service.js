const DownloadableCategory = require("../models/downloadable-category.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  DownloadableCategoryErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class DownloadableCategoryService {
  async createDownloadableCategory(downloadableCategoryData) {
    const downloadableCategory = await DownloadableCategory.create(downloadableCategoryData);
    return await this.getDownloadableCategoryById(downloadableCategory.id);
  }

  async getAllDownloadableCategories() {
    return await DownloadableCategory.findAll({
      order: [["displayOrder", "ASC"]],
    });
  }

  async getPublishedDownloadableCategories() {
    return await DownloadableCategory.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
    });
  }

  async getDownloadableCategoryById(id, includeAdjacent = false) {
    const downloadableCategory = await DownloadableCategory.findOne({
      where: { id },
    });

    if (!downloadableCategory) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: DownloadableCategory,
          orderBy: "createdAt",
        });

        return {
          ...downloadableCategory.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return downloadableCategory;
      }
    }

    return downloadableCategory;
  }

  async updateDownloadableCategory(id, downloadableCategoryData) {
    const downloadableCategory = await DownloadableCategory.findOne({
      where: { id },
    });

    if (!downloadableCategory) {
      throw DownloadableCategoryErrors.notFound();
    }

    await downloadableCategory.update(downloadableCategoryData);

    return await this.getDownloadableCategoryById(id);
  }

  async deleteDownloadableCategory(id) {
    const downloadableCategory = await DownloadableCategory.findOne({
      where: { id },
    });

    if (!downloadableCategory) {
      throw DownloadableCategoryErrors.notFound();
    }

    await downloadableCategory.destroy();

    return true;
  }

  async queryDownloadableCategories({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: DownloadableCategory,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateDownloadableCategoryStatus(ids, status) {
    await DownloadableCategory.update({ status }, { where: { id: ids } });

    const updatedDownloadableCategories = await DownloadableCategory.findAll({
      where: {
        id: ids,
      },
    });

    return updatedDownloadableCategories;
  }
}

module.exports = new DownloadableCategoryService();
