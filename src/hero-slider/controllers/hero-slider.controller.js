const heroSliderService = require("../services/hero-slider.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  HeroSliderErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class HeroSliderController {
  async createHeroSlider(req, res) {
    try {
      const heroSlider = await heroSliderService.createHeroSlider(req.body);
      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.CREATE_SUCCESS, heroSlider);
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.CREATE_FAILED);
    }
  }

  async getAllHeroSliders(req, res) {
    try {
      const heroSliders = await heroSliderService.getAllHeroSliders();
      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.QUERY_SUCCESS, heroSliders);
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.QUERY_FAILED);
    }
  }

  async getPublishedHeroSliders(req, res) {
    try {
      const heroSliders = await heroSliderService.getPublishedHeroSliders();
      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.QUERY_SUCCESS, heroSliders);
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.QUERY_FAILED);
    }
  }

  async getHeroSliderById(req, res) {
    try {
      const heroSlider = await heroSliderService.getHeroSliderById(
        req.params.id,
        true
      );
      if (!heroSlider) {
        throw HeroSliderErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.QUERY_SUCCESS, heroSlider);
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.QUERY_FAILED);
    }
  }

  async queryHeroSliders(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await heroSliderService.queryHeroSliders({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.QUERY_FAILED);
    }
  }

  async updateHeroSlider(req, res) {
    try {
      const heroSlider = await heroSliderService.updateHeroSlider(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.UPDATE_SUCCESS, heroSlider);
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.UPDATE_FAILED);
    }
  }

  async deleteHeroSlider(req, res) {
    try {
      await heroSliderService.deleteHeroSlider(req.params.id);
      handleSuccess(res, SUCCESS_CODES.HERO_SLIDER.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.DELETE_FAILED);
    }
  }

  async updateHeroSliderStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedHeroSliders =
        await heroSliderService.updateHeroSliderStatus(ids, status);
      handleSuccess(
        res,
        SUCCESS_CODES.HERO_SLIDER.UPDATE_SUCCESS,
        updatedHeroSliders
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.HERO_SLIDER.UPDATE_FAILED);
    }
  }
}

module.exports = new HeroSliderController();
