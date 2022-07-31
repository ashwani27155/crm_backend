/** Api for creating ticket: any one can do this for only verify user can do this we use is valid user middleware
 * for validating this
 * --v1 any one can create ticket
 */
const Ticket=require('../models/ticket.model')
const User=require('../models/user.model')
const constants=require('../utils/constants')
const objectConverter=require('../utils/objectConverter')
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
        //after successfully create ticket return the ticket
        return res.status(201).send(objectConverter.ticketResponse(ticket))
    }catch(err){
        console.log(error.message)
        return res.status(500).send({
            message:"Some internal error "
        })
    }
}