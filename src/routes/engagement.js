const router = require('express').Router();
const {create, get, getOne, deleteOne} = require('../controller/engagement')
const {verifyAdmin, verifyUserAdmin} = require('../../middlewares/auth')



router.post('/engagements', [verifyUserAdmin], create)
router.get('/engagements', [verifyUserAdmin], get)


module.exports = router;