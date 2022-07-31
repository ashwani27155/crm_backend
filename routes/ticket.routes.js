/** adding routes for ticketcontroller */
const ticketcontroller=require('../controllers/ticket.controller');
const {authJwt}=require('../middlewares')
module.exports=(app)=>{
    app.post('/crm/api/v1/tickets',[authJwt.verifyToken],ticketcontroller.createTicket)
}