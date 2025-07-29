const{Student}= require('../models/schoolDb')




exports.getAllStudents = async (req,res) => {
    try {
        // we shall use find method
        const students = Student.find().populate('classroom').populate('parent')

        res.json(students)
        
    } catch (error) {
        // handle any error
        res.status(500).json({message:"Error fetching students",error:error.message})
    }
}