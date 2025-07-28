// import the schema
const {Assignment,Classroom, User,Teacher} = require('../models/schoolDb')

// ====================================
// get all the assignments
// we shall include details of classrooms and teacher

exports.getAllAssignments = async (req,res) => {
    try {
        // use the find function to process
        const assignments = await Assignment.find().populate('classroom','name gradeLevel year').populate('postedBy','name email');

        // if a response is success full give the response of assignments
        res.json(assignments)

        
    } catch (error) {
        // handle any error when fetching all the assignments
        res.status(500).json({message:"Error fetching Assignment "})
    }
}

// ==========================
// below is a route to add new assignments
// as we add assignments we shall validate 3 fields i.e teacher, classroom
exports.addAssignments = async (req,res) => {
    
    try {

        // get details of the person already login in from the authentication middleware
        const userId = req.user.userId;
        //  console.log("The logged in ID is ", userId)

        //  fetch the user and populate the teacher field if it exists
        const user= await User.findById(userId).populate('teacher')

        // Block those who are notenlisted as teachers from posting assignments
        if(!user || !user.teacher){
            return res.status(403).json({message:"Only teachers can post assignments"})
        };

        //  extract classroom Id from the incoming request
        const {classroom:classroomId}=req.body;
        // console.log("Classroom Id is ", classroomId)

        // check whether the classroom exists
        const classroomExists = await Classroom.findById(classroomId);
        if(!classroomExists){
            return res.status(404).json({message:"Classroom Not Found"})
        }
        // prepare the assignment data with the postedby set to the current teacher
        const assignmentData = {
            ...req.body,
            postedBy : user.teacher.id
        }
        console.log("The content of assignment data: ", assignmentData)

        // save the assignment to the database
        const newAssignment = new Assignment(assignmentData)
        const savedAssignment = await newAssignment.save();
        // if successfull return a response
        res.status(201).json(savedAssignment)

         
    } catch (error) {
        // handles any error
        res.status(500).json({message:"Failed to add assignments",error:error.message})
    }
};


// ================================
// get assignment based on Id
// we shall go to the teacher and classroom information
exports.getAssignmentById =  async (req,res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('classroom', 'name gradeLevel classYear'.populate('postedBy','name email'))
        
        // check whether assignment exists
        if(!assignment){
            return res.status(404).json({message:"Assignment not found"})

        }
        res.json(assignment)

    } catch (error) {
        // handles any error
        res.status(500).json({message: "Error fetching assignments", error: err.message})
    }
}


// =========================================
// update a given assignment by Id
exports.updateAssignment = async (req,res) => {
    try {
        // find assignment by id and update with new data
        const updated = await Assignment.findByIdAndUpdate(req.params.id,req,body,{new : true})
        
        // check whether there is assignment with a given id
        if(!updated){
            return res.status(404).json({message:"Assignment not found"})
        }
    } catch (error) {
        res.status(500).json({message:"Error updating assignments",error:err.message})
    }
}

// ========================================
// delete assignment
// we shall use the id to do so
exports.deleteAssignment = async (req,res) => {
    try {
        // we shall use find by id and delete

        const deleted = await Assignment.findByIdAndDelete(req.params.id)
        // check whether the given assignment with id is there or not
        if(!deleted){
            return res.status(404).json({message:"Assignment not found"})
        }

        // if the given id is there and deleted return a response 
        res.json({message:"Assignment deleted successfully"})

    } catch (error) {
        res.status(500).json({message:"Error deleting assignment",error: err.message})
    }
}