// import express
const express = require("express");

const router = express.Router();
// import the middleware
const { auth, authorizeRoles } = require("../middleware/auth");

// import the teachers controller
const teacherController = require("../controllers/teacherController");

// below is a route to fetch all teachers
router.get("/", teacherController.getAllTeacher);

// below is a route to add new teacher
router.post("/",auth,authorizeRoles('admin'), teacherController.addTeacher);

// below we fetch details of a given gteacher based on Id
router.get("/:id",auth, teacherController.getTeacherById);

// Below is the route to show classess been taught by a given teacher
router.get("/myClasses",auth, teacherController.getMyClassess);

// below is the route to delete teacher
router.delete("/:id",auth, authorizeRoles('admin'), teacherController.deleteTeacher);

// below is the router to access specific posted assignments
router.get("/myassignments",auth, teacherController.getMyAssignments);

// update teacher based on id
router.put(
  "/:id",
  auth,
  authorizeRoles("admin"),
  teacherController.updateTeacher
);
module.exports = router;
