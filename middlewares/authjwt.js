/**
 * Authentication:-this file contain jwt based authentication
 * 1.If token is pass is valid or not
 * -if it is correct then allow 
 * -if incorrect then don't allow
 * 2.If no token is passed then not allowed
 */
const jwt=require('jsonwebtoken')
const config=require('../configs/auth.config')
const User=require('../models/user.model')//is admin file use this file
const constant=require('../utils/constants')
verifyToken=(req,res,next)=>{
    /** Read the access token from the header */
    const token=req.headers['x-access-token']//access token having key as x-access-token then the access token
    if(!token){//if token is null
        return res.status(403).send({
            message:"No token provided"
        })
    }
    //if the token was provided, we need to verify it
    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message:"Unauthorised"
            })
        }
        //if token is valid then try to read the user id from the decoded token and store it request object
        req.userId=decoded.id
        next();
    })
}
/** Passed access token is admin or not */
isAdmin= async(req,res,next)=>{
    /** Fetch user from the DB using the userId */
    const user=await User.findOne({userId:req.userId});
    /**
     * check what is the user type
     */
    if(user && user.userType==constant.userType.admin){//user check user is present or not
        
    }else{
       return res.status(403).send({
            message:"Requires Admin role"
        })
    }
    next()
}

const authJwt={
    verifyToken:verifyToken,
    isAdmin:isAdmin
}
module.exports=authJwt;