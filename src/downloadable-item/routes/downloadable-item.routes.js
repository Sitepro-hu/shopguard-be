const express = require("express");
const router = express.Router();
const downloadableItemController = require("../controllers/downloadable-item.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", downloadableItemController.getPublishedDownloadableItemsGroupedByCategory);

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.createDownloadableItem
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.queryDownloadableItems
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.getAllDownloadableItems
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.getDownloadableItemById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.updateDownloadableItemStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.updateDownloadableItem
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  downloadableItemController.deleteDownloadableItem
);

module.exports = router;
