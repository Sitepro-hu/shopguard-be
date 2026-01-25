const express = require("express");
const router = express.Router();
const countryController = require("../controllers/country.controller");
const {
  verifyAdminToken,
  checkUserStatus,
} = require("../../user/middlewares/auth.middleware");

// Protected routes (admin only)
router.post(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  countryController.createCountry
);
router.post(
  "/admin/query",
  verifyAdminToken,
  checkUserStatus,
  countryController.queryCountries
);
router.get(
  "/admin",
  verifyAdminToken,
  checkUserStatus,
  countryController.getAllCountries
);
router.get(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  countryController.getCountryById
);
router.put(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  countryController.updateCountry
);
router.delete(
  "/admin/:id",
  verifyAdminToken,
  checkUserStatus,
  countryController.deleteCountry
);

module.exports = router;
