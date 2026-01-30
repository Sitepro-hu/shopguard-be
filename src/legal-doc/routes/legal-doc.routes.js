const express = require("express");
const router = express.Router();
const legalDocController = require("../controllers/legal-doc.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", legalDocController.getPublishedLegalDocs);
router.get("/slug/:slug", legalDocController.getLegalDocBySlug);

// Admin routes
router.post("/admin", verifyAdminToken, checkUserStatus, legalDocController.createLegalDoc);
router.post("/admin/query", verifyAdminToken, checkUserStatus, legalDocController.queryLegalDocs);
router.get("/admin", verifyAdminToken, checkUserStatus, legalDocController.getAllLegalDocs);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, legalDocController.getLegalDocById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, legalDocController.updateLegalDocStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, legalDocController.updateLegalDoc);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, legalDocController.deleteLegalDoc);

module.exports = router;
