const router = require('express').Router();
const {create, getAll, getOne, updateOne, deleteOne} = require('../controller/serviceCategory')
const {verifyAdmin, verifyUserAdmin} = require('../../middlewares/auth')

//create
router.post('/service-category',[verifyAdmin], create)
//get all
router.get('/service-category',[verifyUserAdmin], getAll)
//get one
router.get('/service-category/:id',[verifyUserAdmin], getOne)
//update one
router.put('/service-category/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/service-category/:id',[verifyAdmin], deleteOne)


module.exports = router;