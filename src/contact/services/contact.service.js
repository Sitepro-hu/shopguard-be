const { Contact } = require("../../models");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class ContactService {
  async createContact(contactRaw) {
    const contact = await Contact.create(contactRaw);

    return await this.getContactById(contact.id);
  }

  async getContacts() {
    const contacts = await Contact.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    return contacts;
  }

  async getContactById(id, isRaw = true, includeAdjacent = false) {
    const contact = await Contact.findByPk(id, { raw: isRaw });
    
    if (!contact) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Contact,
          orderBy: "createdAt"
        });

        return {
          ...contact,
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a contact-ot adjuk vissza
        return contact;
      }
    }

    return contact;
  }

  async updateContactStatus(ids, status) {
    await Contact.update({ status }, { where: { id: ids } });

    const updatedContacts = await Contact.findAll({
      raw: true,
      where: {
        id: ids,
      },
    });

    return updatedContacts;
  }

  async removeContact(id) {
    const contact = await this.getContactById(id, false);
    if (!contact) {
      return null;
    }

    await contact.destroy();

    return true;
  }

  async queryContacts({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: Contact,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }
}

module.exports = new ContactService();
