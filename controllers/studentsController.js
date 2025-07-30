const{Student,Classroom,Parent}= require('../models/schoolDb')

// import the multer module
const multer = require('multer')

// import file system module
const fs = require("fs")

// iport the path module so as to get the path of image
const path = require('path')

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
        const{name,dateOfBirth,gender,admissionNumber,parentNationalId,classroomId}=req.body
        // console.log(
        //   name,
        //   dateOfBirth,
        //   gender,
        //   admissionNumber,
        //   parentNational,
        //   classroom
        // );
        // find the parent by use of national id
        const parent = await Parent.findOne({nationalId:parentNationalId})
        if(!parent){
            return res.status(400).json({message:"Parent with the given id does not exist"})
        }
        // step 2 check whether the admin of student has been assigned to another student
        const student = await Student.findOne({admissionNumber})
        if(student){
            return res.status(400).json({message:"Admission number has already been assigned to another student"})
        }
        // step 3
        // check whether the classroom with the given id exist or not
        const classroom = await Classroom.findById(classroomId)
        if(!classroom){
            return res.status(400).json({message:"Classroom with the given id does not exist"})
        }

        // step 4
        // handle the uploaded photo(rename it with the current timestamp return the extenion of the photo)
        let photo = null;
        if(req.file){
            const ext = path.extname(req.file.originalname)
            const newFilename = Date.now() + ext;
            const newPath = path.join('uploads',newFilename)
            fs.renameSync(req.file.path,newPath)


            photo = newPath.replace(/\\/g,'/')
        }

        // step 5
        // create and save new student
        const newStudent = new Student({
            name,dateOfBirth,
            gender,admissionNumber,
            photo,
            parent:parent._id,
            classroom: classroom._id
        })

        const savedStudent = await newStudent.save()

        // step 6 
        // addd student to slassroom if not alteday adde
        if(!classroom.students.includes(savedStudent._id)){
            classroom.students.push(savedStudent._id),
            await classroom.save()
        }
        // if everything goes on well just give response
        res.status(201).json({message:"Student registered successfully",student:savedStudent})


    } catch (error) {
        // handle any error that might occur during registration process
        res.status(400).json({message:"Error adding student",error:error.message})
    }
}
// get a student by use of student id
exports.getStudentById = async (req,res) => {
    try {
        const student = await Student.findById(req.params.id).populate('classroom').populate('parent')
        // check whether that id is there or not
        if(!student){
            return res.status(404).json({message:"Student not found"})

        }

        // if the student with the same id is there show his details
        res.json(student)
        
    } catch (error) {
        res.status(500).json({message:"Error Occured",error:err.message})
    }
}

// update the details of student
exports.updateSudentDetails = async (req,res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id,req.body,{new:true})
        // check whether id exist or not
        if(!updatedStudent){
            return res.status(404).json({message:"Student not found"})
        }
        // if updated successfully return new record
        res.json(updatedStudent)
        
    } catch (error) {
        res.status(400).json({message:"Error updating the details of students",error:err.message})
    }
}

// deleting student
exports.deleteStudent = async (req,res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.param.id);

        // check whether id exist
        if(!deletedStudent){
            return res.status(404).json({message:"Student not found"})
        }
        // remove student from any classroom
        await Classroom.updateMany({students: deletedStudent._id},{$pull:{students:deletedStudent}})

        // if successful return a response
        res.status(200).json({message:"Student successfully deleted"})
        
    } catch (error) {
        res.status(500).json({message:"An error occured",error:err.message})
    }
}