const router = require('express').Router();
const {create, getAll, getOne, updateOne, deleteOne} = require('../controller/productCategory')
const {verifyAdmin} = require('../../middlewares/auth')

//create
router.post('/product-category',[verifyAdmin], create)
//get all
router.get('/product-category',[verifyAdmin], getAll)
//get one
router.get('/product-category/:id',[verifyAdmin], getOne)
//update one
router.put('/product-category/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/product-category/:id',[verifyAdmin], deleteOne)

module.exports = router;