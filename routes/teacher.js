// import express
const express = require("express");

const router = express.Router()
// import the middleware
const{auth,authorizeRoles}=require("../middleware/auth");

// import the teachers controller
const teacherController = require("../controllers/teacherController")

// below is a route to fetch all teachers
router.get("/",auth,teacherController.getAllTeacher)

// below is a route to add new teacher
router.post("/",teacherController.addTeacher)

// below we fetch details of a given gteacher based on Id
router.post("/:id",teacherController.getAllTeacher)


// update teacher based on id
router.put("/:id", authorizeRoles('admin'), teacherController.updateTeacher)
module.exports=router;