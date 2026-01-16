const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { verifyAdminToken, checkUserStatus } = require("../../user/middlewares/auth.middleware");

// Public routes
router.get("/slug/:slug", productController.getProductBySlug);

// Protected routes (admin only)
router.post("/admin", verifyAdminToken, checkUserStatus, productController.createProduct);
router.post("/admin/query", verifyAdminToken, checkUserStatus, productController.queryProducts);
router.get("/admin", verifyAdminToken, checkUserStatus, productController.getAllProducts);
router.get("/admin/:id", verifyAdminToken, checkUserStatus, productController.getProductById);
router.put("/admin/set-status", verifyAdminToken, checkUserStatus, productController.updateProductStatus);
router.put("/admin/:id", verifyAdminToken, checkUserStatus, productController.updateProduct);
router.delete("/admin/:id", verifyAdminToken, checkUserStatus, productController.deleteProduct);

module.exports = router;
