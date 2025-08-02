const express = require('express')
const router = express.Router();
const{auth,authorizeRoles}=require('../middleware/auth')

const assignmentController = require('../controllers/assignmentController')
// below is the route to find all assignments
router.get("/",assignmentController.getAllAssignments)

// add assignment
router.post("/",auth,assignmentController.addAssignments)

// get assignment by id
router.get('/:id',assignmentController.getAssignmentById)

// update assignment based on id
router.put("/:id",assignmentController.updateAssignment)

// delete assignment
router.delete("/:id", assignmentController.deleteAssignment)

module.exports=router;