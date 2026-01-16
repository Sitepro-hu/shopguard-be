const HeroSlider = require("../models/hero-slider.model");
const queryDatabase = require("../../shared/database-helpers/query.helper");
const {
  HeroSliderErrors,
} = require("../../shared/response-helpers/error-helper");
const getAdjacentElements = require("../../shared/database-helpers/adjacent-element.helper");

class HeroSliderService {
  async createHeroSlider(heroSliderData) {
    const heroSlider = await HeroSlider.create(heroSliderData);
    return await this.getHeroSliderById(heroSlider.id);
  }

  async getAllHeroSliders() {
    return await HeroSlider.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async getPublishedHeroSliders() {
    return await HeroSlider.findAll({
      where: { status: "PUBLISHED" },
      order: [["displayOrder", "ASC"]],
    });
  }

  async getHeroSliderById(id, includeAdjacent = false) {
    const heroSlider = await HeroSlider.findOne({ where: { id } });

    if (!heroSlider) {
      return null;
    }

    if (includeAdjacent) {
      try {
        const adjacentElements = await getAdjacentElements({
          id: id,
          model: HeroSlider,
          orderBy: "createdAt"
        });

        return {
          ...heroSlider.toJSON(),
          previousElementId: adjacentElements.previousElementId,
          nextElementId: adjacentElements.nextElementId
        };
      } catch (error) {
        // Ha hiba van az adjacent element lekérdezésben, csak a heroSlider-t adjuk vissza
        return heroSlider;
      }
    }

    return heroSlider;
  }

  async updateHeroSlider(id, heroSliderData) {
    const heroSlider = await HeroSlider.findOne({
      where: { id },
    });

    if (!heroSlider) {
      throw HeroSliderErrors.notFound();
    }

    await heroSlider.update(heroSliderData);

    return await this.getHeroSliderById(id);
  }

  async deleteHeroSlider(id) {
    const heroSlider = await HeroSlider.findOne({
      where: { id },
    });

    if (!heroSlider) {
      throw HeroSliderErrors.notFound();
    }

    await heroSlider.destroy();

    return true;
  }

  async queryHeroSliders({ pagination, sort, search, filters }) {
    const result = await queryDatabase({
      model: HeroSlider,
      pagination,
      sort,
      search,
      filters,
    });

    return result;
  }

  async updateHeroSliderStatus(ids, status) {
    await HeroSlider.update({ status }, { where: { id: ids } });

    const updatedHeroSliders = await HeroSlider.findAll({
      where: {
        id: ids,
      },
    });

    return updatedHeroSliders;
  }
}

module.exports = new HeroSliderService();
