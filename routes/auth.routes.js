/** this file will act as the route for authentication and authorization */
//define the routes- Rest endpoints for user registration
const authController=require('../controllers/auth.controller');
const {verifySignUp}=require('../middlewares')
module.exports=(app)=>{//we use app becase if someone make request then first of request goes to express server so we use app abject
    //post- 127.0.0.1:8081/crm/api/v1/auth/signup
    app.post('/crm/api/v1/auth/signup',[verifySignUp.validateSignupRequest],authController.signup)
     //post- 127.0.0.1:8081/crm/api/v1/auth/signin
     app.post('/crm/api/v1/auth/signin',authController.signin)
}