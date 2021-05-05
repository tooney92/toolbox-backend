const router = require('express').Router();
const {create, getAll, getOne, updateOne, deleteOne} = require('../controller/serviceIssues')
const {verifyAdmin, verifyUserAdmin} = require('../../middlewares/auth')

//create
router.post('/service-issues',[verifyAdmin], create)
//get all
router.get('/service-issues',[verifyUserAdmin], getAll)
//get one
router.get('/service-issues/:id',[verifyUserAdmin], getOne)
//update one
router.put('/service-issues/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/service-issues/:id',[verifyAdmin], deleteOne)

module.exports = router;