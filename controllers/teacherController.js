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

// update teacher password when login


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

// ===============
// Deleting teacher endpoint
// Delink/Unsign
exports.deleteTeacher= async(req,res)=>{
    try{
        // get the teachers id from the passed request with params
        const teacherId = req.params.id
        // console.log("The inserted teacher id is ",teacherId)

        // delete a teacher with the passed id
        const deletedTeacher =  await Teacher.findByIdAndDelete(teacherId)

        // check whether the passed id exists or not
        if(!deletedTeacher){
            return res.status(404).json({message:"Teacher not found"})
        };

        // Delink/Unassign the teacher from previously passed
        await Classroom.updateMany({teacher:TeacherId},{$set:{teacher:null}})

        // delete the teachers records inside of the users collection
        await User.findOneAndDelete({teacher:teacherId})

        // give response to user if operation is successfull
        res.json({message:"Teacher Successfully Deleted"})

    }catch(error){
        // handle any error that may occur
        res.status(500).json({message:"Error deleting the teacher",error:err.message})
    }
}

// ===========
// we shall get only classes this teacher is teaching
exports.getMyClassess = async (req,res) => {
    try{
        
        // get teachers id from logged in
        const userId = req.user.UserId;

        // find the user and populate the teacher reference
        const user = await User.findById(userId).populate('teacher')

        // check if the user exists and is linked to a teacher
        if(!user|| !user.teacher){
            return res.status(404).json({message:"Teacher Not Found"})
        }

        // if the teacher with the id is found get all the classrooms taught by this teacher
        // include the students therein
        const classes = await Classroom.findById({teacher:user.teacher._id}).populate('students');  // we show the students in that particular class

        // give a response back
        res.json(classes)

    }catch(error){
        // handle any error during operation
        res.status(500).json({message:"Error occurred getting the class",error:err.message})
    }
}

// ===========================================
// below is the route to find assignments shared by teacher
exports.getMyAssignments = async (req,res) => {
    try {
        // Get the user id
        const userId = req.user.userId;
        // find a teacher based on a given id
        const user = await User.findById(userId).populate('teacher')

        // based on this we are able to know who posted the assignment
        const assignments = await Assignment.find({ postedBy: user.teacher._id}).populate('classroom').sort({dueDate:1}); // below populate classroom details

        console.log("The value of assignments are:", assignments)
        res.status(200).json(assignments)
        
    } catch (error) {
        // handle any error if any 
        res.status(500).json({message:err.message})
    }
}