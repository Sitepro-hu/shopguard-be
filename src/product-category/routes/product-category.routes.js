const express = require("express");
const router = express.Router();
const productCategoryController = require("../controllers/product-category.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/", productCategoryController.getPublishedProductCategories);

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, productCategoryController.createProductCategory);
router.post("/admin/query", verifyAdminToken, checkUserStatus, productCategoryController.queryProductCategories);
router.get("/admin", verifyAdminToken, checkUserStatus, productCategoryController.getAllProductCategories);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, productCategoryController.getProductCategoryById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, productCategoryController.updateProductCategoryStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, productCategoryController.updateProductCategory);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, productCategoryController.deleteProductCategory);

module.exports = router;
