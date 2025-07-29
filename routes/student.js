// import the express module
const express = require("express")
const router = express.Router()
const studentController = require('../controllers/studentsController')

// below is a route to add new student
router.post("/",studentController.addStudent)

// below is the route to get all students
router.get("/",studentController.getAllStudents)


// export the module
module.exports = router;