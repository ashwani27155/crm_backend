const verifySignUp=require('../middlewares/verifySignUp')
const authJwt=require('./authjwt')
module.exports={
    verifySignUp,
    authJwt
}