const router = require('express').Router();
const {create, get} = require('../controller/invoice')
const {verifyAdmin, verifyUserAdmin} = require('../../middlewares/auth')



router.post('/invoice', [verifyUserAdmin], create)
router.get('/invoice', [verifyUserAdmin], get)


module.exports = router;