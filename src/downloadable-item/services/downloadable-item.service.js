const DownloadableItem = require("../models/downloadable-item.model");
const DownloadableCategory = require("../models/downloadable-category.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  DownloadableItemErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class DownloadableItemService {
  async createDownloadableItem(downloadableItemData) {
    const downloadableItem = await DownloadableItem.create(downloadableItemData);
    return await this.getDownloadableItemById(downloadableItem.id);
  }

  async getAllDownloadableItems() {
    return await DownloadableItem.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: DownloadableCategory,
          as: "category",
          required: false,
        },
      ],
    });
  }

  async getPublishedDownloadableItems() {
    return await DownloadableItem.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
      include: [
        {
          model: DownloadableCategory,
          as: "category",
          required: false,
          where: { status: "PUBLISHED" },
        },
      ],
    });
  }

  async getDownloadableItemById(id, includeAdjacent = false) {
    const downloadableItem = await DownloadableItem.findOne({
      where: { id },
      include: [
        {
          model: DownloadableCategory,
          as: "category",
          required: false,
        },
      ],
    });

    if (!downloadableItem) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: DownloadableItem,
          orderBy: "createdAt",
        });

        return {
          ...downloadableItem.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return downloadableItem;
      }
    }

    return downloadableItem;
  }

  async updateDownloadableItem(id, downloadableItemData) {
    const downloadableItem = await DownloadableItem.findOne({
      where: { id },
    });

    if (!downloadableItem) {
      throw DownloadableItemErrors.notFound();
    }

    await downloadableItem.update(downloadableItemData);

    return await this.getDownloadableItemById(id);
  }

  async deleteDownloadableItem(id) {
    const downloadableItem = await DownloadableItem.findOne({
      where: { id },
    });

    if (!downloadableItem) {
      throw DownloadableItemErrors.notFound();
    }

    await downloadableItem.destroy();

    return true;
  }

  async queryDownloadableItems({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: DownloadableItem,
      pagination,
      sort,
      search,
      filters,
      include: [
        {
          model: DownloadableCategory,
          as: "category",
          required: false,
        },
      ],
    });

    return result;
  }

  async updateDownloadableItemStatus(ids, status) {
    await DownloadableItem.update({ status }, { where: { id: ids } });

    const updatedDownloadableItems = await DownloadableItem.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: DownloadableCategory,
          as: "category",
          required: false,
        },
      ],
    });

    return updatedDownloadableItems;
  }
}

module.exports = new DownloadableItemService();
