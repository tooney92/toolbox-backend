const router = require('express').Router();

router.get('/products/home', async(req, res)=>{

    try {
        res.send("hello")
    } catch (error) {
        res.send("error")
    }
})

module.exports = router;