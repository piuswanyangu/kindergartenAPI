// this is the entry point of API
const express=require("express");
const mongoose=require("mongoose");

// import the dotenv
require('dotenv').config()

// import cors so that the front end and backend can communicate
const cors=require('cors');



// create an app based on express
const app = express();
app.use(cors());

// Below we allow our API to accept data inform of json format
app.use(express.json());

// import the login router for the admin
const loginRoutes = require("./routes/login");
app.use("/api/auth",loginRoutes)

// import classroom routes
const classroomRoutes=require('./routes/classroom');
app.use("/api/classrooms",classroomRoutes)

// specify the parents routes
const parentRoutes = require("./routes/parent")
app.use("/api/parents",parentRoutes)


// specify the routes for fetching students details
const studentRoutes = require("./routes/student")
app.use("/api/students",studentRoutes)
// import the assignment routes
const assignmentRoutes = require('./routes/assignment')
app.use("/api/assignments",assignmentRoutes)

// import teachers route
const teachersRoutes = require("./routes/teacher")
app.use("/api/teachers", teachersRoutes)



// specify the route sto the admindashboard
const adminDashboardRoutes = require("./routes/dashboardAdmin")
app.use("/api/dashboardAdmin", adminDashboardRoutes);

// specify the routes to the teacher dashboard
const teacherDashboardRoutes = require("./routes/statsTeacher")
app.use("/api/teacherDashboard",teacherDashboardRoutes)
// specify the routes to access parent dashboard stats
const parentDashboardRoutes = require("./routes/parentDashboardStats")
app.use("/api/parentDashboard",parentDashboardRoutes)


// test/establish the connection to the database using the link specified inside of the dotenv file
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo successfully connected"))
.catch(err =>console.error("Mongodb connection error",err))



const PORT = process.env.PORT||3000
app.listen(PORT,()=>{
    console.log("The server is running on port:" ,PORT)
})