const express = require("express");
const router = express.Router()

// import the admindasboard controller
const adminDashboardController = require("../controllers/dashboardAdminController")


router.get("/",adminDashboardController.getDashboardStatistics)

module.exports = router;