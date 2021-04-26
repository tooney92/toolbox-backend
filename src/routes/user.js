const router = require('express').Router();
const {signUp, login} = require("../controller/user")

router.post('/user/signup', signUp) 

router.post('/user/login', login)


// router.get('/user/error', async(req, res)=>{
//     try {
//         // res.send("hello")
//         throw new Error("exception occured")
//     } catch (error) {
//         logger.error(`route: /users/error, message - ${error.message}, stack trace - ${error.stack}`);
//         res.status(500).send(`Our server is busy right now. Please try later.`)
//     }
// })

module.exports = router;