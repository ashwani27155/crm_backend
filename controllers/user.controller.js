/**this file have all the logic to manipulate the user resource */
const User=require('../models/user.model');
const objectConverter=require('../utils/objectConverter')//use for returning a custom response 
/**
 * Fetch all the user 
 * --only admin should able to do this
 * --admin should able to fetch all the record based on different filter like
 *  1.name
 *  2.userStatus
 *  3.userType
 */
/** fetch the user based on their name userstatus and userType from query parameter */

exports.findAll= async(req,res) =>{
    const nameReq=req.query.name;
const userTypeReq=req.query.userType;
const userStatusReq=req.query.userStatus
const mongoQueryobj={}//all query object are stored in a array
if(nameReq && userStatusReq && userTypeReq){
    mongoQueryobj.name=nameReq;
    mongoQueryobj.userStatus=userStatusReq;
    mongoQueryobj.userType=userTypeReq
}
if(nameReq && userStatusReq){
    mongoQueryobj.name=nameReq;
    mongoQueryobj.userStatus=userStatusReq;
}
if(userStatusReq && userTypeReq){
    mongoQueryobj.userStatus=userStatusReq;
    mongoQueryobj.userType=userTypeReq
}
if(nameReq && userTypeReq){
    mongoQueryobj.name=nameReq;
    mongoQueryobj.userType=userTypeReq
}
if(nameReq){
    mongoQueryobj.name=nameReq;
}
if(userTypeReq){
    mongoQueryobj.userType=userTypeReq
}
if(userStatusReq){
    mongoQueryobj.userStatus=userStatusReq;
}//end query parameter request
    try{
        const users= await User.find(mongoQueryobj)
        return res.status(200).send(objectConverter.userResponse(users));
    }catch(err){
        console.log(error.message)
        return res.status(500).send({
            message:"some internal error while fetching the all users"
        })
    }
}

/** 
 * Fetch the user based the userid
 */
exports.findUserById=async(req,res)=>{
    const userIdReq=req.params.userId//reading from the request parameter
    const user=await User.find({userId:userIdReq})
    //check if particular user id user is present or not
    if(user){
        res.status(200).send(objectConverter.userResponse(user))
    }else{
        res.status(200).send({
            message:"User with id"+userIdReq+"doesn't exist"
        })
    }
}
/**
 * update the user:-userStatus,userType
 * --only admin should able to do that
 */
exports.updateUser=(req,res)=>{
    /** one way of updating user */
    try{
        const userIdReq=req.params.userId
    const user=User.findOneAndUpdate({
        userId:userIdReq
    },{
        name:req.body.name,
        userStatus:req.body.userStatus,
        userType:req.body.userType
    }).exec();
    }catch(err){
        console.log(error.message)
        return res.status(500).send({
            message:"Internal server error while updating the user"
        })
    }
}
