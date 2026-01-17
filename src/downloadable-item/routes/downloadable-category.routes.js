const express = require("express");
const router = express.Router();
const downloadableCategoryController = require("../controllers/downloadable-category.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.createDownloadableCategory
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.queryDownloadableCategories
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.getAllDownloadableCategories
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.getDownloadableCategoryById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.updateDownloadableCategoryStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.updateDownloadableCategory
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  downloadableCategoryController.deleteDownloadableCategory
);

module.exports = router;
