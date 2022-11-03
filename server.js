const express=require('express')
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt')
const serverConfig=require('./configs/server.config');
const dbConfig=require('./configs/db.config');
const User=require('./models/user.model')
const app=express();
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
/** setup the mongodb connection and create admin user */
mongoose.connect(dbConfig.DB_URL,()=>{
    console.log("mongodb connected successfully");
    //initialization
    init()//for creating admin user
})
async function init(){
    //protect multiple admin user creation we check if admin is present or not because init method is called
    // every time so we check if admin user is created then return that user else create admin user
    var user= await User.findOne({userId:"admin"})
    if(user){
        return// if user is present then return 
    }else{

    //create admin user 
        const user=await User.create({
            name:"vish",
            userId:"admin",
            email:'kankvish7777@gmail.com',
            userType:"ADMIN",
            password:bcrypt.hashSync("welcome00123",8)
        })
   
        console.log("admin user created");
    }
}
require('./routes/auth.routes')(app)
require('./routes/user.route')(app)
require('./routes/ticket.routes')(app)
/**
 * Start the express server,
 * Need to export it so that it can be
 * used by supertest for initiating a request
 */

module.exports=app.listen(serverConfig.PORT,()=>{
    console.log("Application has started on the post",serverConfig.PORT);
})