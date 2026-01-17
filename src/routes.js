const express = require("express");

const userRoutes = require("./user/routes/user.routes");
const profileRoutes = require("./user/routes/profile.routes");
const authRoutes = require("./user/routes/auth.routes");
const fileRoutes = require("./file/routes/file.routes");
const contactRoutes = require("./contact/routes/contact.routes");
const faqRoutes = require("./faq/routes/faq.routes");
const faqCategoryRoutes = require("./faq/routes/faq-category.routes");
const testimonialRoutes = require("./testimonial/routes/testimonial.routes");
const heroSliderRoutes = require("./hero-slider/routes/hero-slider.routes");
const productCategoryRoutes = require("./product-category/routes/product-category.routes");
const productSubcategoryRoutes = require("./product-subcategory/routes/product-subcategory.routes");
const productRoutes = require("./product/routes/product.routes");
const referenceRoutes = require("./reference/routes/reference.routes");
const mediaRoutes = require("./media/routes/media.routes");
const partnerRoutes = require("./partner/routes/partner.routes");
const downloadableItemRoutes = require("./downloadable-item/routes/downloadable-item.routes");
const downloadableCategoryRoutes = require("./downloadable-item/routes/downloadable-category.routes");
const router = express.Router();

// Routes
router.use("/api/user", userRoutes);
router.use("/api/profile", profileRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/file", fileRoutes);
router.use("/api/contact", contactRoutes);
router.use("/api/faq", faqRoutes);
router.use("/api/faq-category", faqCategoryRoutes);
router.use("/api/testimonial", testimonialRoutes);
router.use("/api/hero-slider", heroSliderRoutes);
router.use("/api/product-category", productCategoryRoutes);
router.use("/api/product-subcategory", productSubcategoryRoutes);
router.use("/api/product", productRoutes);
router.use("/api/reference", referenceRoutes);
router.use("/api/media", mediaRoutes);
router.use("/api/partner", partnerRoutes);
router.use("/api/downloadable-item", downloadableItemRoutes);
router.use("/api/downloadable-category", downloadableCategoryRoutes);


module.exports = router;
