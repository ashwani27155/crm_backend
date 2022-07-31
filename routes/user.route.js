/** Defining the routes for the user resourse */
const userController=require('../controllers/user.controller')
const {authJwt}=require('../middlewares')
module.exports=(app)=>{
    app.get('/crm/v1/api/auth/users',[authJwt.verifyToken,authJwt.isAdmin],userController.findAll)
    app.get('/crm/v1/api/auth/:userIdReq',[authJwt.verifyToken],userController.findUserById)
    app.get('/crm/v1/api/auth/:userIdReq',[authJwt.verifyToken,authJwt.isAdmin],userController.updateUser)

}