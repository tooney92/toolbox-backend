const router = require('express').Router();
const {create, getAll, getOne, updateOne, deactivate, login, handyManUpdate} = require('../controller/handyman')
const {verifyAdmin, verifyUserAdmin, verifyUserHandyManAdmin} = require('../../middlewares/auth')

//create
router.post('/handyMan',[verifyAdmin], create)
//log in
router.post('/handyMan/login', login)
//get all
router.get('/handyMan',[verifyUserAdmin], getAll)
//get one
router.get('/handyMan/:id',[verifyUserHandyManAdmin], getOne)
//update one
router.put('/handyMan/:id',[verifyAdmin], updateOne)
//update by handy man
router.put('/handyMan/:id',[verifyAdmin], handyManUpdate)
//delete one
router.delete('/handyMan/deactivate/:id',[verifyAdmin], deactivate)

module.exports = router;