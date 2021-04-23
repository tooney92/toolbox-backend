const router = require('express').Router();

router.get('/handy-man/home', async(req, res)=>{

    try {
        res.send("hello")
    } catch (error) {
        res.send("error")
    }
})

module.exports = router;