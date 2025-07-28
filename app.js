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

// import classroom routes
const classroomRoutes=require('./routes/classroom');
app.use("/api/classrooms",classroomRoutes)

// specify the parents routes
const parentRoutes = require("./routes/parent")
app.use("/api/parents",parentRoutes)

// import the assignment routes
const assignmentRoutes = require('./routes/assignment')
app.use("/api/assignments",assignmentRoutes)

// import teachers route
const teachersRoutes = require("./routes/teacher")
app.use("/api/teachers", teachersRoutes)

// import the login router for the admin
const loginRoutes = require("./routes/login");
app.use("/api/auth",loginRoutes)


// test/establish the connection to the database using the link specified inside of the dotenv file
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo successfully connected"))
.catch(err =>console.error("Mongodb connection error",err))



const PORT = process.env.PORT||3000
app.listen(PORT,()=>{
    console.log("The server is running on port:" ,PORT)
})