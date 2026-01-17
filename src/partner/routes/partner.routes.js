const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", partnerController.getPublishedPartners);

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  partnerController.createPartner
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  partnerController.queryPartners
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  partnerController.getAllPartners
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  partnerController.getPartnerById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  partnerController.updatePartnerStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  partnerController.updatePartner
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  partnerController.deletePartner
);

module.exports = router;
