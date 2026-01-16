const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faq.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  faqController.createFAQ
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  faqController.queryFAQs
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  faqController.getAllFAQs
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  faqController.getFAQById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  faqController.updateFAQStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  faqController.updateFAQ
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  faqController.deleteFAQ
);

module.exports = router;
