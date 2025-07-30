const express = require("express");
const router = express.Router()

const statsTeacher = require("../controllers/statsTeacherController")
const{auth,authorizeRoles}= require("../middleware/auth")

// get teacher stats
router.get("/",statsTeacher.getTeacherStas)