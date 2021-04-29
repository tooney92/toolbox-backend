const router = require('express').Router();
const {create, getAll, getOne, updateOne, deactivate} = require('../controller/handyman')
const {verifyAdmin} = require('../../middlewares/auth')

//create
router.post('/admin-handyMan',[verifyAdmin], create)
//get all
router.get('/admin-handyMan',[verifyAdmin], getAll)
//get one
router.get('/admin-handyMan/:id',[verifyAdmin], getOne)
//update one
router.put('/admin-handyMan/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/admin-handyMan/deactivate/:id',[verifyAdmin], deactivate)

module.exports = router;