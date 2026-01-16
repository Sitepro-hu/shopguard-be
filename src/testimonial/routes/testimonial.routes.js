const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonial.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", testimonialController.getPublishedTestimonials);

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, testimonialController.createTestimonial);
router.post("/admin/query", verifyAdminToken, checkUserStatus, testimonialController.queryTestimonials);
router.get("/admin", verifyAdminToken, checkUserStatus, testimonialController.getAllTestimonials);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, testimonialController.getTestimonialById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, testimonialController.updateTestimonialStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, testimonialController.updateTestimonial);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, testimonialController.deleteTestimonial);

module.exports = router; 