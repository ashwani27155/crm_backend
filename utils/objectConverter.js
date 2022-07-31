/** this file have all the logic to convert the object 
 * by using this file we can able to return custom response this response not include the user password
*/
exports.userResponse=(users)=>{//take users from userController when we use and then find all the details
    usersResponse=[];
    users.forEach(user=>{
        usersResponse.push({
            name:user.name,
            userId:user.userId,
            email:user.email,
            userType:user.userType,
            userStatus:user.userStatus
        })
    })
    return usersResponse
}
exports.ticketResponse=(ticket)=>{
    return {
        title:ticket.title,
        description:ticket.description,
        ticketPriority:ticket.ticketPriority,
        status:ticket.status,
        reporter:ticket.reporter,
        assignee:ticket.assignee,
        id:ticket._id,
        createdAt:ticket.createdAt,
        updatedAt:ticket.updatedAt
    }
}