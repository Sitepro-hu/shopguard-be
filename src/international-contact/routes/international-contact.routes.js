const express = require("express");
const router = express.Router();
const internationalContactController = require("../controllers/international-contact.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", internationalContactController.getPublishedInternationalContacts);

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.createInternationalContact
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.queryInternationalContacts
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.getAllInternationalContacts
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.getInternationalContactById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.updateInternationalContactStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.updateInternationalContact
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  internationalContactController.deleteInternationalContact
);

module.exports = router;
