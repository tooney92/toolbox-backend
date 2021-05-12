const router = require('express').Router();
const {get, withdraw} = require('../controller/wallet')
const {verifyHandyMan} = require('../../middlewares/auth')




router.get('/handyMan-wallet', [verifyHandyMan], get)
router.put('/handyMan-wallet/withdraw', [verifyHandyMan], withdraw)


module.exports = router;