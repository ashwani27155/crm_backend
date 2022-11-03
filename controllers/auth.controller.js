const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const constants=require('../utils/constants')
const User=require('../models/user.model')
const config=require('../configs/auth.config');
/** Controller for signup  */
exports.signup= async(req,res)=>{
    /** How to user signup will happen */
    var userStatus=req.body.userStatus;//FOR CHEACKING USER STATUS
    if(!userStatus){//if user is not null
        if(!req.body.userType || req.body.userType==constants.userType.customer){//user type is not defined or checkuser type user type is customer
            userStatus=constants.userStatus.approved
        }else{
            userStatus=constants.userStatus.pending
        }
    }//checking user status end here
    const userObjToBeStoredInDB={
        name:req.body.name,
        userId:req.body.userId,
        email:req.body.email,
        userType:req.body.userType,
        password:bcrypt.hashSync(req.body.password,8),
        userStatus:userStatus
    }
   /** Insert this new user to the database for this we need user model so we require user model*/
  try{
    const userCreated=await User.create(userObjToBeStoredInDB)//create user inside mondodb and wait until user is created so we use await keyword
    console.log("user created", userCreated)
    /** Return the response using the object: userCreated */
    const userCreationResponse={
     name:userCreated.name,
     userId:userCreated.userId,
     email:userCreated.email,
     userType:userCreated.userType,
     userStatus:userCreated.userStatus,
     createdAt:userCreated.createdAt,
     updatedAt:userCreated.updatedAt
     
    }
    res.status(201).send(userCreationResponse)
  }catch(err){
    console.error("Error while creating new user",err.message);
    res.status(500).send({
        message:"Some internal error while inserting new user"
    })
  }
}//end signup

/** Controller for signin */            
exports.signin=async (req,res)=>{
    //search the user if it exists
    try{
        var user=await User.findOne({userId:req.body.userId});
    }catch(err){
        console.log(err.message);
    }
    if(user==null){
        return res.status(400).send({
            message:"Failed! User id doesn't exist"
        })
    }
    /** Check if the user is approved */
    if(user.userStatus!=constants.userStatus.approved){
        return res.status(200).send({
            message:"Can't allow the login as the user is still not approved"
        })
    }
    /** if user is existing,so now we will do the password matching */
    const isPasswordValid=bcrypt.compareSync(req.body.password,user.password)
    //if password is invalid
    if(!isPasswordValid){
        return res.status(401).send({
            message:"Invalid Password"
        })
    }
    /** After successfully login need to generate access token now */
    const token=jwt.sign({id:user.userId},config.secret,{expiresIn:600});
    //send the response back
    res.status(200).send({
        name:user.name,
        userId:user.userId,
        email:user.email,
        userType:user.userType,
        userStatus:user.userStatus,
        accessToken:token
    })
};