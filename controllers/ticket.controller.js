/** Api for creating ticket: any one can do this for only verify user can do this we use is valid user middleware
 * for validating this
 * --v1 any one can create ticket
 */
const Ticket=require('../models/ticket.model')
const User=require('../models/user.model')
const { userType } = require('../utils/constants')
const constants=require('../utils/constants')
const objectConverter=require('../utils/objectConverter')
const notificationServiceClient=require('../utils/NotificationServiceClient');
exports.createTicket=async(req,res)=>{
    //logic for creating ticket
    const ticketObj={
        title:req.body.title,
        ticketPriority:req.body.ticketPriority,
        description:req.body.description
    }
    //check if any engineer is available 
    try{
        const engineer=await User.findOne({
            userType:constants.userType.engineer,
            userStatus:constants.userStatus.approved
        })
        if(engineer){//if engineer available if available the assign that ticket
            ticketObj.assignee=engineer.userId
        }
    
        const ticket=await Ticket.create(ticketObj)
        /*
        After ticket created update the user document and engineer document 
        for this first we need to find the userid and assigne engineer id, which is got it
        from middleware
        **/
       //for user
       if(ticket){
        const user=await User.findOne({
            userId:req.userId
        })
        user.ticketsCreated.push(ticket._id)
        await user.save();
        //update engineer document
        engineer.ticketsAssigned.push(ticket._id)
        await engineer.save();
        /** 
         * right place for writing code for sending email
         * 
         * 
         * call the notification service to send the email
         * 
         * i need to have the client for calling the external service
         */
         notificationServiceClient(ticket._id,"Created new ticket:"+ticket._id,ticket.description,user.email+","+engineer.email,user.email)

          //after successfully create ticket return the ticket
        return res.status(201).send(objectConverter.ticketResponse(ticket))
        }
      
    }catch(err){
        console.log(error.message)
        return res.status(500).send({
            message:"Some internal error "
        })
   }
}
/**
 * Api to fetch all the tickets
 * HW
 * allow the user to fetch all the ticket based on state by using query param 
 * 1. open 
 * 2. closd
 * -- Depending on the user I need to return different list of tickets:
 * 1.ADMIN-- return all tickets
 * 2.ENGINEER--All the tickets ,either created or assigned to him/her
 * 3.CUSTOMER--All the tickets created by him
 */

 exports.getAllTickets = async (req, res) => {
    /**
     * I want to get the list of all the tickets
     */
    const queryObj = {};
    //check status of the ticket is present or not means ticket is open or closed state
    if (req.query.status != undefined) {
        queryObj.status = req.query.status;
    }

    const user = await User.findOne({ userId: req.userId });
    if (user.userType == constants.userTypes.admin) {
        //Return all the tickets
        // No need to change anything in the query object
        //for admin query object is open and return all tickets
    } 
    //return all ticket which is created by a customer
    else if (user.userType == constants.userTypes.customer) {

        if (user.ticketsCreated == null || user.ticketsCreated.length == 0) {
            return res.status(200).send({
                message: "No tickets created by you !!!"
            })
        }

        queryObj._id = {
            $in: user.ticketsCreated // array of ticket ids
        }

    }else{

        /**
         * 
         * Assignment  :
         * 
         * Approach 1 :  $or ---
         * 
         * Approach 2 : in the in clause put both the lists
         *     ticketsCreated
         *     ticketsAssigned
         */
        //User is of type engineer
        queryObj._id = {
            $in: user.ticketsCreated // array of ticket ids
        };
        // All the tickets where I am the assignee
        queryObj.assignee = req.userId
    }
    const tickets = await Ticket.find(queryObj);

    res.status(200).send(objectConverter.ticketListResponse(tickets))

}
/**
 * Fetch the ticket based on the userid
 */
exports.getOneTicket=async (req,res)=>{
    const ticket=await Ticket.findOne({
        _id:req.params.id
    });
    res.status(200).send(objectConverter.ticketResponse(ticket));
}
/**
 * API for getting all the tickets
*/
exports.updateTicket=async (req,res)=>{
    //check if the ticket exists
    const ticket=await Ticket.findOne({
        _id:req.params.id
    });
    if(ticket==null){
        return res.status(200).send({
            message:"Ticket doesn't exist"
        })
    }
    //only ticket requester is allow to update the ticket
    //Assigne engineer should also allow to update the ticket
    /**
     * for this we need to find the user id
     * and then calculate all the ticket id created by this user and match the above ticket id
     * is preset or not
     */
    const user=User.findOne({
        userId:req.userId
    })
    //if the ticket is not assigned any engineer, any engineer can self assign thenselves the given ticket
    if(ticket.assignee==undefined){
        ticket.assignee=req.userId
    }
    //this condition is only checking for the user who created the ticket
    if((user.ticketsCreated == undefined || !user.ticketsCreated.includes(req.params.id)) && !(user.userType== constants.userTypes.admin) && !(ticket.assignee == req.userId)){
        //user.ticketsCreated return array of ticket id created by the above user if 
        //.includes(req.params.id )check this ticket id is present in the all ticket array or not
        return res.status(403).send({
            message:"Only owner of the ticket is allowd to update"
        })
    }
    //update the attribute of the saved ticket
    ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
    ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
    ticket.status = req.body.status != undefined ? req.body.status : ticket.status
    notificationServiceClient(ticket._id,"status changed:"+ticket._id,)
    //ability to re-assign the ticket
    if(user.userType== constants.userTypes.admin){
        ticket.assignee=req.body.assignee!=undefined ? req.body.assignee :ticket.assignee
    }
    //saved the changed ticket
    const updatedTicket = await ticket.save();
    //return the updated ticked
    return res.status(200).send(objectConverter.ticketResponse(updatedTicket));
}