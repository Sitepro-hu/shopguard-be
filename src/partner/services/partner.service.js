const Partner = require("../models/partner.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  PartnerErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class PartnerService {
  async createPartner(partnerData) {
    const partner = await Partner.create(partnerData);
    return await this.getPartnerById(partner.id);
  }

  async getAllPartners() {
    return await Partner.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedPartners() {
    return await Partner.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
    });
  }

  async getPartnerById(id, includeAdjacent = false) {
    const partner = await Partner.findOne({
      where: { id },
    });

    if (!partner) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Partner,
          orderBy: "createdAt",
        });

        return {
          ...partner.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return partner;
      }
    }

    return partner;
  }

  async updatePartner(id, partnerData) {
    const partner = await Partner.findOne({
      where: { id },
    });

    if (!partner) {
      throw PartnerErrors.notFound();
    }

    await partner.update(partnerData);

    return await this.getPartnerById(id);
  }

  async deletePartner(id) {
    const partner = await Partner.findOne({
      where: { id },
    });

    if (!partner) {
      throw PartnerErrors.notFound();
    }

    await partner.destroy();

    return true;
  }

  async queryPartners({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: Partner,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updatePartnerStatus(ids, status) {
    await Partner.update({ status }, { where: { id: ids } });

    const updatedPartners = await Partner.findAll({
      where: {
        id: ids,
      },
    });

    return updatedPartners;
  }
}

module.exports = new PartnerService();
