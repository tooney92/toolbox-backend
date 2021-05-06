const router = require('express').Router();
const {create, getAll, getOne, updateOne, deactivate} = require('../controller/handyman')
const {verifyAdmin, verifyUserAdmin} = require('../../middlewares/auth')

//create
router.post('/handyMan',[verifyAdmin], create)
//get all
router.get('/handyMan',[verifyUserAdmin], getAll)
//get one
router.get('/handyMan/:id',[verifyUserAdmin], getOne)
//update one
router.put('/handyMan/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/handyMan/deactivate/:id',[verifyAdmin], deactivate)

module.exports = router;