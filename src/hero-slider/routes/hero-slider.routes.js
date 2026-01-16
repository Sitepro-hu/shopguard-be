const express = require("express");
const router = express.Router();
const heroSliderController = require("../controllers/hero-slider.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", heroSliderController.getPublishedHeroSliders);

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, heroSliderController.createHeroSlider);
router.post("/admin/query", verifyAdminToken, checkUserStatus, heroSliderController.queryHeroSliders);
router.get("/admin", verifyAdminToken, checkUserStatus, heroSliderController.getAllHeroSliders);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, heroSliderController.getHeroSliderById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, heroSliderController.updateHeroSliderStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, heroSliderController.updateHeroSlider);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, heroSliderController.deleteHeroSlider);

module.exports = router;
