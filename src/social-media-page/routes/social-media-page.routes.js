const express = require("express");
const router = express.Router();
const socialMediaPageController = require("../controllers/social-media-page.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public: csak a publikus lista (nincs slug)
router.get("/", socialMediaPageController.getPublishedSocialMediaPages);

// Admin
router.post("/admin", verifyAdminToken, checkUserStatus, socialMediaPageController.createSocialMediaPage);
router.post("/admin/query", verifyAdminToken, checkUserStatus, socialMediaPageController.querySocialMediaPages);
router.get("/admin", verifyAdminToken, checkUserStatus, socialMediaPageController.getAllSocialMediaPages);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, socialMediaPageController.getSocialMediaPageById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, socialMediaPageController.updateSocialMediaPageStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, socialMediaPageController.updateSocialMediaPage);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, socialMediaPageController.deleteSocialMediaPage);

module.exports = router;
