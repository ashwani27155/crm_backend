/** This file store the schema for the user resource */
const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    /**
     * we create schema for user 
     * name, userId,password,email,createdAt, updatedAt,userTye(admin|engineer|customer)
     * userStatus(pending|rejected|approved)
     * 
     */
    name:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        minLength:true,
        unique:true
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:()=>{
            return Date.now();
        }
    },
    updatedAt:{
        type:Date,
        immutable:true,
        default:()=>{
            return Date.now();
        }
    },
    userType:{
        type:String,
        required:true,
        default:"CUSTOMER"
    },
    userStatus:{
        type:String,
        required:true,
        default:"APPROVED"
    }
})
module.exports=mongoose.model('User',userSchema)