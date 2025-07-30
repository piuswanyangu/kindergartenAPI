const {User,Classroom,Assignment}=require("../models/schoolDb");

exports.getTeacherStas = async (req,res) => {
    try {
        const userId = req.user.userId
        // console.log("The logged in user id :", userId)

        // check whether the id is there or not
        const user = await User.findById(userId)
        if(!user|| !user.teacher){
            return res.status(404).json({message:"Teacher not found"})
        }

        const teacherId = user.teacher;
        // step 2 Aggregate classroom to get class count and the student totals
        const classStats = await Classroom.Aggregate([
            {$match:{teacher:teacherId}},
            {
                $group:{
                    _id:null,
                    totalClassess:{$sum:1},
                    totalStudents:{$sum:{$size:"$students"}}
                }
            }
        ]);
        // step 3 Count the assignments
        const totalAssignments = await Assignment.countDocuments({postedBy:teacherId})

        // give final response
        const result = {
            totalClassess:classStats[0]?.totallClasses||0,
            totalStudents:classStats[0]?.totalStudents||0,
            totalAssignments
        }
        res.json(result)
        
    } catch (error) {
        res.status(500).json({message:"Error occurred",error:error.message})
    }
}