const express = require("express");
const router = express.Router();
const productLinkController = require("../controllers/product-link.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, productLinkController.createProductLink);
router.post("/admin/query", verifyAdminToken, checkUserStatus, productLinkController.queryProductLinks);
router.get("/admin", verifyAdminToken, checkUserStatus, productLinkController.getAllProductLinks);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, productLinkController.getProductLinkById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, productLinkController.updateProductLinkStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, productLinkController.updateProductLink);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, productLinkController.deleteProductLink);

module.exports = router;
