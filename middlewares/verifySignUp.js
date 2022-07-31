/** This file will contain the custom middlewares for verifying the request body */
const User=require('../models/user.model')
const constants=require('../utils/constants');
validateSignupRequest=async(req,res,next)=>{
    //validate if username exists
    if(!req.body.name){
        return res.status(400).send({
            message:"Failed! username is not provided"
        })
    }
    //Validate if the userId not  exists
    if(!req.body.userId){
        return res.status(400).send({
            message:"Failed! userId is not provided"
        })
    }
    //validate if the userId is already present
    const user=await User.findOne({userId:req.body.userId});//this line use user model file
    if(user!=null){
        return res.status(400).send({
            message:"Failed! userId already exist"
        })
    }
    //validate email
    if(!req.body.email){
        return res.status(400).send({
            message:"Failed! email id is not provided"
        })
    }
    //check if email id is already exist
    const email=await User.findOne({email:req.body.email})
    if(email!=null){
        return res.status(400).send({
            message:"Failed! email id is already exist"
        })
    }
    //validate password
    if(!req.body.password){
        return res.status(400).send({
            message:"Failed! user password is not provided"
        })
    }
    next()
}
module.exports={
    validateSignupRequest:validateSignupRequest
}