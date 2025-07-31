const express = require("express")
const router = express.Router()
const parentDashboardController = require("../controllers/parentsDashboardController")
const {auth,authorizeRoles}=require("../middleware/auth")


// route to get dashboard stats
router.get("/",parentDashboardController.getParentDashboard)
router.get("/:id",parentDashboardController.getClassAssignment)


module.exports=router;