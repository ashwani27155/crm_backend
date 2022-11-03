/** adding routes for ticketcontroller */
const ticketcontroller=require('../controllers/ticket.controller');
const {authJwt}=require('../middlewares')
module.exports=(app)=>{
    app.post('/crm/api/v1/tickets',[authJwt.verifyToken],ticketcontroller.createTicket)
    app.get('/crm/api/v1/tickets',[authJwt.verifyToken],ticketcontroller.getAllTickets)
    app.get('/crm/api/v1/tickets/:id',[authJwt.verifyToken],ticketcontroller.getOneTicket)
    app.put('/crm/api/v1/tickets/:id',[authJwt.verifyToken],ticketcontroller.updateTicket)
}