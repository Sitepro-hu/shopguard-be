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


module.exports = router;
