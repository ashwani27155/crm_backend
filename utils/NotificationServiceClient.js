

/**
 * Logic to make a POST call to the Notification service
 */
const Client =require('node-rest-client').Client;
const client=new Client();
exports.client = client;
/**
 * Expose a function which will take the following information
 * subject
 * content
 * receipentsEmail
 * requester
 * ticketId
 * 
 * and then make a post call
 */
module.exports=(ticketId,subject,content,emailIds,requester)=>{
    /**
     * Make a POST call
     * for making a post call we need to know these things
     * 1. URI :127.0.0.1:7777/notification_service/api/v1/notification
     * 2. HTTP Verb :POST
     * 3. Request Body :
     * 4. Headers :
     */
    //request body
    const reqBody={
        subject:subject,
        content:content,
        recepientEmail:emailIds,
        requester:requester,
        ticketId:ticketId
    }
    const header={
        "Content-Type":"application/json"
    }
    const args={
        data:reqBody,
        headers:header
    }
   var req= client.post("https://127.0.0.1:7777/notification_service/api/v1/notification",args,(data,respose)=>{
        console.log('Request sent')
        console.log(data);
    })
    /**
     * Check for the error
     */
    req.on('requestTimeout',()=>{
        console.log('request has expired')
        req.abort();
    })
    req.on('responseTimeout',()=>{
        console.log('response has expired')
    })
    req.on('error',(err)=>{
        console.log('request error',err);
    });
}