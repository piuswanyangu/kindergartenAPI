const{Student,Teacher,Classroom,Parent,User}= require("../models/schoolDb")

exports.getDashboardStatistics = async (req,res) => {
    try {
      // show the total count entries   i.e students , classrooms, users, parents teacher
      const [
        totalStudents,
        totalTeachers,
        totalParents,
        totalClassroom,
        activeUsers,
      ] = Promise.all([
        totalStudents.countDocuments(),
        Teacher.countDocuments(),
        Parent.countDocuments(),
        Classroom.countDocuments(),
        User.countDocuments({ isActive: true }),
      ]);
      // show admin students recently added
      const recentStudents = await Student.find()
        .sort({ createdAt: -1 })
        .limit(5);

      // return teachers records based on how they have been added
const recentTeachers = await Teachers.find().sort({createdAt:-1}).limit(5)
      // return all the stats in a single response
      res.json({
        totalStudents,
        totalTeachers,
        totalParents,
        totalClassroom,
        activeUsers,
        recentStudents,
        recentTeachers,
      });
    } catch (error) {
        res.status(500).json({message:"Failed to load admin dashboard statistics",error:error.message})
    }
}