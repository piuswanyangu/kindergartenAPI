// specify the db schema
const mongoose=require('mongoose');

const Schema = mongoose.Schema;
// define the user schema
const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, rquired: true },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "parent"],
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      default: null,
    },
  },
  { timestamps: true }
);

// Teacher schema
const teacherSchema=new Schema({
    name:{type:String,require:true},
    email:{type:String},
    phone:{type:String},
    subject:{type:String}
},{timestamps:true})

// classroom schema name assigned teacher and the students(array reference several of them)
const classroomSchema=new Schema({
    name:{type:String,required:true},
    gradeLevel:{type:String},
    classYear : {type:String},
    teacher : {type:mongoose.Schema.Types.ObjectId,ref:'Teacher',default:null},
    students:[{type:mongoose.Schema.Types.ObjectId,ref:'Student',default:null}]
},{timestamps:true});

// parents schema
const parentSchema = new Schema({
    name:{type:String,require:true},
    email:{type:String},
    phone:{type:String},
    nationalId:{type:String,required:true,unique:true},
    address:{type:String}
},{timestamps:true})

// student schema
const studentSchema =new Schema({
    name:{type:String,required:true},
    dateOfBirth:{type:Date,required:true},
    gender:{type:String},
    photo:{type:String},
    admissionNumber:{type:String,unique:true},
    classroom:{type:mongoose.Schema.Types.ObjectId,ref:'classroom',default:true},// references a given class based on id
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'Parent'}// reference a parent based on id
},{timestamps:true});

// assignment schema
const assignmentSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String},
    dueDate:{type:Date},
    classroom:{type:mongoose.Schema.Types.ObjectId,ref:'classroom'},// references the class assigned
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'}// references the teacher who has given the assignment
},{timestamps:true})


// export the schemas to make them accessible throughout the application
const User = mongoose.model('User',userSchema);
const Teacher=mongoose.model('Teacher',teacherSchema);
const Classroom=mongoose.model('Classroom',classroomSchema);
const Parent= mongoose.model('Parent',parentSchema);
const Student=mongoose.model('Student',studentSchema);
const Assignment=mongoose.model('Assignment',assignmentSchema);

module.exports={User,Teacher,Classroom,Parent,Student,Assignment};