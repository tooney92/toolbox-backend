const router = require('express').Router();

router.get('/product-category/home', async(req, res)=>{

    try {
        res.send("hello")
    } catch (error) {
        res.send("error")
    }
})

module.exports = router;