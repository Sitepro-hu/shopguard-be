const Testimonial = require("../models/testimonial.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  TestimonialErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class TestimonialService {
  async createTestimonial(testimonialData) {
    const testimonial = await Testimonial.create(testimonialData);
    return await this.getTestimonialById(testimonial.id);
  }

  async getAllTestimonials() {
    return await Testimonial.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedTestimonials() {
    return await Testimonial.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
    });
  }

  async getTestimonialById(id, includeAdjacent = false) {
    const testimonial = await Testimonial.findOne({ where: { id } });

    if (!testimonial) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: Testimonial,
          orderBy: "createdAt"
        });

        return {
          ...testimonial.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a testimonial-t adjuk vissza
        return testimonial;
      }
    }

    return testimonial;
  }

  async updateTestimonial(id, testimonialData) {
    const testimonial = await Testimonial.findOne({
      where: { id },
    });

    if (!testimonial) {
      throw TestimonialErrors.notFound();
    }

    await testimonial.update(testimonialData);

    return await this.getTestimonialById(id);
  }

  async deleteTestimonial(id) {
    const testimonial = await Testimonial.findOne({
      where: { id },
    });

    if (!testimonial) {
      throw TestimonialErrors.notFound();
    }

    await testimonial.destroy();

    return true;
  }

  async queryTestimonials({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: Testimonial,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateTestimonialStatus(ids, status) {
    await Testimonial.update({ status }, { where: { id: ids } });

    const updatedTestimonials = await Testimonial.findAll({
      where: {
        id: ids,
      },
    });

    return updatedTestimonials;
  }
}

module.exports = new TestimonialService();
