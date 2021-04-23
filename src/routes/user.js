const router = require('express').Router();
const logger = require('../../util/winston');

router.get('/user/home', async(req, res)=>{

    try {
        res.send("hello")
    } catch (error) {
        res.send("error")
    }
})
router.get('/user/error', async(req, res)=>{

    try {
        // res.send("hello")
        throw new Error("exception occured")
    } catch (error) {
        logger.error(`message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send(`Our server is busy right now. Please try later.`)
    }
})

module.exports = router;