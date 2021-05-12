const router = require('express').Router();
const {get, accept, decline} = require('../controller/handyManEngagement')
const {verifyHandyManAdmin, verifyHandyMan} = require('../../middlewares/auth')




router.get('/handyMan-engagements', [verifyHandyManAdmin], get)
router.put('/handyMan-engagements/accept/:engagementId', [verifyHandyMan], accept)
router.put('/handyMan-engagements/decline/:engagementId', [verifyHandyMan], decline)
// router.delete('/engagements/:id', [verifyUserAdmin], deleteOne)


module.exports = router;