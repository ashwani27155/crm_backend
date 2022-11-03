/**
 * this file will be used for writing the test case for ticket controller
 */
const ticketController=require('../../controllers/ticket.controller');
const {mockRequest, mockResponse}=require('../inteceptor');
const User=require('../../models/user.model')
const Ticket=require('../../models/ticket.model');
const client=require('../../utils/NotificationServiceClient').client
const ticketRequestBody={
    title:"test",
    ticketPriority:4,
    description:"test"
};
const savedUserObj = {//when any going to cal the findOne method then this is call and it is mocked
    userType: "ADMIN",
    password: "323fser4353",
    name: "Test",
    userId: 1,
    email: "test@relevel.com",
    ticketsCreated: [],
    ticketsAssigned: [],
    save: jest.fn() //mock it
}
const updateRequestBody = {
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status : "CLOSED",
    reporter: 1,
    assignee: 1,
    createdAt : Date.now(),
    updatedAt : Date.now(),
    _id: "saffs2324"
}
const createdTicketBody = {//some one call the ticket create method then this value will be pass
    _id: "saffs2324",
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: 1,
    assignee: 1,
    createdAt : Date.now(),
    updatedAt : Date.now(),
    save: jest.fn()
    //.mockReturnValue(Promise.resolve(updateRequestBody)) //mock it
}
/**
 * test the create ticket functionality
 */
describe("testing the create ticket feature",()=>{
    if("unit test the ability to successfully create a new ticket",async()=>{
        /**
         * external entities we depend on:
         * 1. req,res
         */
        const req=mockRequest();
        const res=mockResponse();
        /**
         *  if i call the create ticket method then this req need to have the body object
         */
        req.body=ticketRequestBody;
        req.userId=1;//my request is ready
        /** 
         * we don't need to mock the response object because it dependent upon the 
         * req
         */
        /** 
         * mocking ans spying user findOne
         */
            const userSpy=jest.spyOn(User,'findOne').mockReturnValue(Promise.resolve(savedUserObj));
        /**
         * mocking the ticket creation also
         */
         const ticketSpy = jest.spyOn(Ticket, 'create').mockImplementation(
            (ticketRequestBody) => Promise.resolve(createdTicketBody));
            /**
             * mock the email client
             */
             const clientSpy = jest.spyOn(client, 'post').mockImplementation(
                (url, args, cb) => cb('Test', null));
        /** 
         * execute the test
         */
        await ticketController.createTicket(req,res);
         /**
         * Validations
         */
          expect(userSpy).toHaveBeenCalled();
          expect(ticketSpy).toHaveBeenCalled();
          expect(clientSpy).toHaveBeenCalled();

    });
})