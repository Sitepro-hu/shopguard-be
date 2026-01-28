const express = require("express");
const router = express.Router();
const glossaryController = require("../controllers/glossary.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", glossaryController.getPublishedGlossaries);

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, glossaryController.createGlossary);
router.post("/admin/query", verifyAdminToken, checkUserStatus, glossaryController.queryGlossaries);
router.get("/admin", verifyAdminToken, checkUserStatus, glossaryController.getAllGlossaries);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, glossaryController.getGlossaryById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, glossaryController.updateGlossaryStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, glossaryController.updateGlossary);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, glossaryController.deleteGlossary);

module.exports = router;
