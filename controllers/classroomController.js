// import the classroom schema
const {Classroom}= require("../models/schoolDb")

// implement the crud operation for the classroom

// add a new classroom
exports.addClassroom = async (req,res) => {
    try {
        
        console.log("It contains", req.body)
        // Create a new classroom using the request data
        const newClassroom = new Classroom(req.body);

        // save the new classroom to the database
        const savedClassroom = await newClassroom.save()

        // return the saved classroom as a response
        res.status(201).json({message: "Added new classroom"})

    } catch (error) {
        res.status(400).json({message:"Error adding a class", error:err.message})
    }
    
}


// ====================
//  fetch all classrooms
exports.getAllClassrooms = async (req,res)=>{
    try {
        // by use of the function find we can fetch all the classrooms
        const classrooms = await Classroom.find()

        // return all the classrooms
        res.json(classrooms)
        
    } catch (error) {
        res.status(500).json({message:"Error Fetching Classrooms",error:err.message})
    }
}

// ================
//  fetch a classroom based on ID
exports.getClassroomById = async (req,res) => {
    try {
        // we shall use the find by id function to do this
        // the id we shall pass it as parameter on the url
        const classroom = await Classroom.findById( req.params.id )

        console.log("The content of classroom is: ",classroom)
        // if the classroom is not found return a response
        if(!classroom){
            return res.status(404).json({message:"Classroom not found"})
        };

        // if the class is there return the details
        res.json(classroom)
        
    } catch (error) {
        res.status(500).json({message:"Error fetching the class",error:err.message})
    }
}

// ==============
// update a classroom
// below is the end point
exports.updateClassroom = async (req, res) => {
  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // runValidators is useful on updates
    );

    if (!updatedClassroom) {
      return res.status(404).json({ message: "Class not found. Check id." });
    }

    return res.json(updatedClassroom);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating classroom", error: error.message });
  }
};



//  delete classroom based on id
exports.deleteClassroom = async (req,res) => {
    try {
        // we shall use the function find by id and delete
        const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id)

        // check the classroom whether it exists or not before deleting
        if(!deletedClassroom){
            return res.status(404).json({message:"Classroom not found"})

        }

        // if the classroom exists and deletd give a response
        res.json({message:"Classroom successfully deleted"})
    } catch (error) {
        res.status(500).json({message:"Error deleting classroom",error:err.message})
    }
}