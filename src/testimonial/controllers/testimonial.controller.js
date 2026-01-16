const testimonialService = require("../services/testimonial.service");
const {
  ERROR_CODES,
} = require("../../shared/response-helpers/response-helper");
const {
  TestimonialErrors,
  handleError,
} = require("../../shared/response-helpers/error-helper");
const {
  SUCCESS_CODES,
  handleSuccess,
} = require("../../shared/response-helpers/success-helper");

class TestimonialController {
  async createTestimonial(req, res) {
    try {
      const testimonial = await testimonialService.createTestimonial(req.body);
      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.CREATE_SUCCESS, testimonial);
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.CREATE_FAILED);
    }
  }

  async getAllTestimonials(req, res) {
    try {
      const testimonials = await testimonialService.getAllTestimonials();
      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.QUERY_SUCCESS, testimonials);
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.QUERY_FAILED);
    }
  }

  async getPublishedTestimonials(req, res) {
    try {
      const testimonials = await testimonialService.getPublishedTestimonials();
      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.QUERY_SUCCESS, testimonials);
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.QUERY_FAILED);
    }
  }

  async getTestimonialById(req, res) {
    try {
      const testimonial = await testimonialService.getTestimonialById(
        req.params.id,
        true
      );
      if (!testimonial) {
        throw TestimonialErrors.notFound();
      }
      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.QUERY_SUCCESS, testimonial);
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.QUERY_FAILED);
    }
  }

  async queryTestimonials(req, res) {
    try {
      const { pagination, sort, search, filters } = req.body;
      const result = await testimonialService.queryTestimonials({
        pagination,
        sort,
        search,
        filters,
      });

      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.QUERY_SUCCESS, {
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.QUERY_FAILED);
    }
  }

  async updateTestimonial(req, res) {
    try {
      const testimonial = await testimonialService.updateTestimonial(
        req.params.id,
        req.body
      );
      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.UPDATE_SUCCESS, testimonial);
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.UPDATE_FAILED);
    }
  }

  async deleteTestimonial(req, res) {
    try {
      await testimonialService.deleteTestimonial(req.params.id);
      handleSuccess(res, SUCCESS_CODES.TESTIMONIAL.DELETE_SUCCESS);
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.DELETE_FAILED);
    }
  }

  async updateTestimonialStatus(req, res) {
    try {
      const { ids, status } = req.body;
      const updatedTestimonials =
        await testimonialService.updateTestimonialStatus(ids, status);
      handleSuccess(
        res,
        SUCCESS_CODES.TESTIMONIAL.UPDATE_SUCCESS,
        updatedTestimonials
      );
    } catch (error) {
      handleError(res, error, ERROR_CODES.TESTIMONIAL.UPDATE_FAILED);
    }
  }
}

module.exports = new TestimonialController();
