const express = require("express");
const router = express.Router();
const productSubcategoryController = require("../controllers/product-subcategory.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Public routes
router.get(
  "/slug/:slug",
  productSubcategoryController.getProductSubcategoryBySlug
);

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.createProductSubcategory
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.queryProductSubcategories
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.getAllProductSubcategories
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.getProductSubcategoryById
);
router.put(
  "/admin/set-status",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.updateProductSubcategoryStatus
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.updateProductSubcategory
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  productSubcategoryController.deleteProductSubcategory
);

module.exports = router;
