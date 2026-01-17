const express = require("express");
const router = express.Router();
const referenceController = require("../controllers/reference.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", referenceController.getPublishedReferences);
router.post("/query", referenceController.queryReferences);
router.get("/slug/:slug", referenceController.getReferenceBySlug);

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  referenceController.createReference
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  referenceController.queryReferences
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  referenceController.getAllReferences
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  referenceController.getReferenceById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  referenceController.updateReferenceStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  referenceController.updateReference
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  referenceController.deleteReference
);

module.exports = router;
