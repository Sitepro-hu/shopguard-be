const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/media.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", mediaController.getPublishedMedia);
router.post("/query", mediaController.queryMedia);
router.get("/slug/:slug", mediaController.getMediaBySlug);

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  mediaController.createMedia
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  mediaController.queryMedia
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  mediaController.getAllMedia
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  mediaController.getMediaById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  mediaController.updateMediaStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  mediaController.updateMedia
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  mediaController.deleteMedia
);

module.exports = router;
