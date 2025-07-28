// classroom routes
const express=require('express')
const router = express.Router();
const classroomController = require('../controllers/classroomController')


// import the auth from middleare so as to ensure the person who is adding a new classroom is authenticated
const {auth, authorizeRoles}=require("../middleware/auth")


// adding new class router
router.post("/",classroomController.addClassroom)


// below is the route to get all classroom
router.get("/",classroomController.getAllClassrooms)

// below is the route for fetching a single classroom
router.get("/:id",auth, classroomController.getClassroomById)

// below is an update route
router.put("/:id",classroomController.updateClassroom)

// below is the end point to delete classroom 
router.delete(
  "/:id",
  auth,
  authorizeRoles("admin"),
  classroomController.deleteClassroom
);

module.exports=router;