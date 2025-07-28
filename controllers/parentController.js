// import parent schema
const{Parent,User}=require('../models/schoolDb');
// import the bcrypt module so as to hash the password
const bcrypt = require('bcrypt')

// fetch/get all parents
exports.getAllParents = async (req,res) => {
    try {
        
        // we shall use find function to accompliss this
        const parents = await Parent.find()

        // give details of the parent as a response
        res.json(parents)

    } catch (error) {
        // handles any error that may occur
        res.status(500).json({message:"Errot fetching parents data",error:err.message})
    }
}

// =================================
// add new parent
exports.addParent = async (req,res) => {
    try {
        // destructure the request bode
        const{name,email,phone,nationalId,address}= req.body
        // console.log("The information from body are", name,email,nationalID,address)

        // check whether the parent already exist based on the email address passed
        const existsParentEmail = await User.findOne({email})
        if(existsParentEmail){
            return res.status(400).json({message:"Parent with this email addres already exists"})
        }

        // check whether a parent with the given Id number already exists
        const existIdNumber = await Parent.findOne({nationalId})
        if(existIdNumber){
            return res.status(400).json({message:"Parent with the same national Id Number already registered"})
        }
        // create and save the parent document
        const newParent = new Parent(req.body)
        const savedParent = await newParent.save()

        // console.log("The details inside of saved parent are", savedParent)

        // set the default password which shall be changed by the parent when he/she login on the dashboard
        const defaultPassword = 'parent1234';
        const hashedPassword = await bcrypt.hash(defaultPassword,10)

        //  we create a correspondimg user document with the role 'parent'
        const newUser = new User({name,email,nationalId,password:hashedPassword,role:'parent',parent:savedParent._id})
        // console.log("the new user",newUser)
        await newUser.save()

        // if the details of the parents are save successfully return a response with the save details
        res.status(201).json({message:"Parent saved successfully",parent:savedParent})

        
    } catch (error) {
        res.status(400).json({message:"Failed to add a parent",error:error.message})
    }

    
}
// =====================================
// get a parent by use of Id
exports.getParentById =async (req,res) => {
    try {
        const parent = await Parent.findOne({nationalId:req.params.id})
        if(!parent){
            return res.status(404).json({message:"Parent not found"})
        }
        res.json(parent)
        
    } catch (error) {
        // handles any error that may occur
        res.status(500).json({message:"Error fetching parent",error:err.message})
    }
}
// =================================
// update
exports.updateParent = async (req,res) => {
    try {
        // we shall update a parent by use of the id
        const updatedParent = await Parent.findByIdAndUpdate(req.params.id,req.body,{new:true})

        // if the parent with the given id does not exists give a response
        if(!updatedParent){
            return res.status(404).json({message:"Parent not found"})
        }
        // if the passed id is there procceed to update and give a response with the new details
        res.json(updatedParent)
        
    } catch (error) {
        // handle the error that might occur during update
        res.status(500).json({message:"Error updating the parent",error:err.message})
    }
}
// ===========================
// delete
exports.deleteParent = async (req,res) => {
    try {
        // we shall use find by id and delete
        const deletedParent = await Parent.findByIdAndDelete(req.params.id)

        // check whether the given id exist or not
        if(!deletedParent){
            return res.status(404).json({message:"Parent with the Id not found"})

        }
        
            // delink from user collection
            await User.findOneAndDelete({parent: req.params.id})
            // if successfull
            res.json({message:"Parent and the associated user accounts deleted successfully"})
        
    } catch (error) {
        // handles any error
        res.status(500).json({message:"Error deleting the teacher",error:err.message})
    }
}