const{Student,Assignment,Classroom,Parent,User}= require("../models/schoolDb")

// get the parents dashboard info 
exports.getParentDashboard = async (req,res) => {
    try {
        // get the id of the parent who is signed in
        const userId = req.user.userId;
        // console.log("The logged in parents id is:",userId)
        // find user and populate parent reference
        const user = await User.findById(userId).populate('parent')

        if(!user|| !user.parent){
            return res.status(404).json({message:"Parent profile not found"})
        }
        const parent = user.parent;
        // get children(students) linked to this parent
        const children = await Student.find({parent:parent._id}).populate('classroom')
        // return the children as a response
        res.json({parent,children})
    } catch (error) {
        // handle any error if any
        res.status(500).json({message:"Error fetching dashboard details",error:error.message})
    }
}
// below is the route to assignment of the students
exports.getClassAssignment = async (req,res) => {
    try {
        // get class id as params
        const classId = req.params.id;
        // fetch assignments tha are posted in that class including teachers details 
        const assignments = await Assignment.find({classroom:classId}).populate('postedBy').sort({dueDate:1})

        res.json(assignments)
        
    } catch (error) {
        // handle any error arising
        res.status(500).json({message:"Error fetching Assignments",error:error.message})
    }
}