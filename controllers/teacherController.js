const{Teacher,User,Assignment,Classroom}= require('../models/schoolDb');
const bcrypt = require('bcrypt')



// Adding a new teacher
exports.addTeacher = async (req,res) => {
    try {
        // step1: Create a Teacher document with data gotten from insomnia
        // get the email address from the sent request
        const {email}=req.body;
        // console.log("The email is: ", email)

        const existingEmail = await Teacher.findOne({email})
        if(existingEmail){
            return res.status(404).json({message:"Teacher Already Exists"})
        }
        // if the email does not exist inside the db proceed to register a teacher
        const newTeacher = new Teacher(req.body);
        const savedTeacher = await newTeacher.save();
        // console.log("The teachers details are: ", savedTeacher)

        // step 2: Create a corresponding user document for login purposes

        // create a default password for the teacher which he shall later own change when he login
        const defaultPassword = 'teacher1234';

        // hash the default password
        const hashedPassword = await bcrypt.hash(defaultPassword,10)

        // create a user with teachers name email, hashpassword and role='teacher
        const newUser = new User({
            name: savedTeacher.name,
            email: savedTeacher.email,
            password:hashedPassword,
            role:'teacher',
            teacher : savedTeacher._id // this is the field that is linking the two collection
        });

        // save the new user document
        await newUser.save();

        //Give back a response if the records have been successfully saved
        res.status(201).json({message:"Teacher and user accounts created successfully",teacher:savedTeacher})


    } catch (error) {
        // handle any error like the validation error or db error
        res.status(400).json({message:"Error while adding a teacher",error:err.message}) 
    }
}

// =========
// geting all teachers
exports.getAllTeacher = async (req,res)=>{
    try {
        // we shall use find method to retrieve all teachers
        const teachers = await Teacher.find()

        // give a response with the details of all the teachers
        res.json(teachers)

    } catch(error){
        // handle any error incase of any
        res.status(500).json({message:"Error fetching teachers", error: error.message})
    }
}

// ======
// fetch a teacher based on teachers id
exports.getTeacherById = async (req, res)=>{
    try{

        // fetch the users id (the person logged in)
        const userId = req.user.userId;
        // fetch details of user from collection
        const user = await User.findById(userId).populate('teacher')

        // check whether he is registered in the db
        if(!user || user.teacher){
            return res.ststus(404).json({message:"Teacher Not Found"})
        }
        const teacher = user.teacher;
        const teacherId = teacher._id;

        // Below we populate the classes taught by teacher together with students in there
        const classrooms = await  Classroom.find({teacher:teacherId}).populate('students','name admissionNumber')

        // below also fetch the assignment the teacher has given
        const assignment = await Assignment.find({postedBy:teacherId}).populate('classroom','name')

        // return a response to the user
        res.json({teacher,classroom,assignment})


    } catch(error){
        res.status(500).json({message:"Error fetching teachers record",error:err.message})
    }
}
// ==================
// updating the details of the teacher
exports.updateTeacher = async (req,res)=>{
    try{
        // update teachers data from the request body
        // return the updated data
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,{new:true}
        );

        // check wheteher their is any teacher found based on a given id
        if(!updatedTeacher){
            return res.status(404).json({message:"Teacher not found"})
        }

        // if the id exists and successful update has happenned return new records
        res.json(updatedTeacher)

    }catch(error){
        res.status(400).json({message:"Error updating the teacher",error:err.message})
    }

};