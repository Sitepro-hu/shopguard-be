const InternationalContact = require("../models/international-contact.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  InternationalContactErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class InternationalContactService {
  async createInternationalContact(internationalContactData) {
    const internationalContact = await InternationalContact.create(internationalContactData);
    return await this.getInternationalContactById(internationalContact.id);
  }

  async getAllInternationalContacts() {
    return await InternationalContact.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedInternationalContacts() {
    return await InternationalContact.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
    });
  }

  async getInternationalContactById(id, includeAdjacent = false) {
    const internationalContact = await InternationalContact.findOne({
      where: { id },
    });

    if (!internationalContact) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: InternationalContact,
          orderBy: "createdAt",
        });

        return {
          ...internationalContact.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId,
        };
      } catch (error) {
        return internationalContact;
      }
    }

    return internationalContact;
  }

  async updateInternationalContact(id, internationalContactData) {
    const internationalContact = await InternationalContact.findOne({
      where: { id },
    });

    if (!internationalContact) {
      throw InternationalContactErrors.notFound();
    }

    await internationalContact.update(internationalContactData);

    return await this.getInternationalContactById(id);
  }

  async deleteInternationalContact(id) {
    const internationalContact = await InternationalContact.findOne({
      where: { id },
    });

    if (!internationalContact) {
      throw InternationalContactErrors.notFound();
    }

    await internationalContact.destroy();

    return true;
  }

  async queryInternationalContacts({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: InternationalContact,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateInternationalContactStatus(ids, status) {
    await InternationalContact.update({ status }, { where: { id: ids } });

    const updatedInternationalContacts = await InternationalContact.findAll({
      where: {
        id: ids,
      },
    });

    return updatedInternationalContacts;
  }
}

module.exports = new InternationalContactService();
