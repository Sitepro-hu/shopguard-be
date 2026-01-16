const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Admin
router.post("/admin/query", verifyAdminToken, checkUserStatus, contactController.queryContacts);
router.get("/admin", verifyAdminToken, checkUserStatus, contactController.getContacts);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, contactController.getContactById);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  contactController.updateContactStatus
);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, contactController.removeContact);

// Public
router.post("/", contactController.createContact);

module.exports = router;
