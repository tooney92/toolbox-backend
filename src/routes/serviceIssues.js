const router = require('express').Router();
const {create, getAll, getOne} = require('../controller/serviceIssues')
const {verifyAdmin} = require('../../middlewares/auth')

//create
router.post('/service-issues',[verifyAdmin], create)
//get all
router.get('/service-issues',[verifyAdmin], getAll)
//get one
router.get('/service-issues/:id',[verifyAdmin], getOne)


module.exports = router;