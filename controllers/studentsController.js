const{Student,Classroom,Parent}= require('../models/schoolDb')

// import the multer module
const multer = require('multer')

// import file system module
const fs = require("fs")

// below is to fetch all students
exports.getAllStudents = async (req,res) => {
    try {
        // we shall use find method
        const students = await Student.find().populate('classroom').populate('parent')

        res.json(students)
        
    } catch (error) {
        // handle any error
        res.status(500).json({message:"Error fetching students",error:error.message})
    }
}

// ================================
// below is the function to add a student
// configure by use  of multer module the storage of image
const upload = multer({dest:'uploads'})
exports.uploadStudentPhoto = upload.single('photo')


// add student
exports.addStudent = async (req,res) => {
    try {
        // destructure the details of coming from passed request
        const{name,dateOfBirth,gender,admissionNumber,parentNationalId,classroom}=req.body
        // console.log(
        //   name,
        //   dateOfBirth,
        //   gender,
        //   admissionNumber,
        //   parentNational,
        //   classroom
        // );
        // find the parent by use of national id
        const parent = await Parent.findOne({nationalId:parent})
        if(!parent){
            return res.status(400).json({message:"Parent with the given id does not exist"})
        }
        // step 2 check whether the admin of student has been assigned to another student
        const student = await Student.findOne({admissionNumber})
        if(student){
            return res.status(400).json({message:"Admission number has already been assigned to another student"})
        }


    } catch (error) {
        // handle any error that might occur during registration process
        res.status(400).json({message:"Error adding student",error:error.message})
    }
}