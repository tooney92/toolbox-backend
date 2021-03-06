const router = require('express').Router();
const {create, get, update, acceptInvoice, declineInvoice, deleteInvoice} = require('../controller/invoice')
const {verifyHandyMan, verifyUser} = require('../../middlewares/auth')


router.post('/invoice', [verifyHandyMan], create)
router.get('/invoice', [verifyHandyMan], get)
router.put('/invoice/:invoiceId', [verifyHandyMan], update)
router.put('/invoice/accept/:invoiceId', [verifyUser], acceptInvoice)
router.put('/invoice/decline/:invoiceId', [verifyUser], declineInvoice)
router.delete('/invoice/:invoiceId', [verifyHandyMan], deleteInvoice)

module.exports = router;