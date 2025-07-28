const express = require('express');

// import the middleware for security purposes
const{auth,authorizeRoles}=require('../middleware/auth')

const router = express.Router();

// import the parent controller
const parentController = require("../controllers/parentController")

router.get("/",parentController.getAllParents)

// add parent
router.post("/",parentController.addParent)

// fetch a parent by use of Id
router.get("/:id",parentController.getParentById)

// update the details of the parent by use of d
router.put('/:id',parentController.updateParent)

// delete tparent based on id passed
router.delete('/:id',parentController.deleteParent);


module.exports = router;