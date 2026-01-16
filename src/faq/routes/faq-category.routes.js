const express = require("express");
const router = express.Router();
const faqCategoryController = require("../controllers/faq-category.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.createFaqCategory
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.queryFaqCategories
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.getAllFaqCategories
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.getFaqCategoryById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.updateFaqCategoryStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.updateFaqCategory
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  faqCategoryController.deleteFaqCategory
);

// Public routes
router.get("/", faqCategoryController.getPublishedFaqCategories);

module.exports = router;
