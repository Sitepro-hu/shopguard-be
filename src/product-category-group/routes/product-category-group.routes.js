const express = require("express");
const router = express.Router();
const productCategoryGroupController = require("../controllers/product-category-group.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", productCategoryGroupController.getPublishedProductCategoryGroups);

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, productCategoryGroupController.createProductCategoryGroup);
router.post("/admin/query", verifyAdminToken, checkUserStatus, productCategoryGroupController.queryProductCategoryGroups);
router.get("/admin", verifyAdminToken, checkUserStatus, productCategoryGroupController.getAllProductCategoryGroups);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, productCategoryGroupController.getProductCategoryGroupById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, productCategoryGroupController.updateProductCategoryGroupStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, productCategoryGroupController.updateProductCategoryGroup);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, productCategoryGroupController.deleteProductCategoryGroup);

module.exports = router;
