const router = require('express').Router();
const {create, getAll, getOne, updateOne, deleteOne} = require('../controller/productCategory')
const {verifyAdmin, verifyUserHandyManAdmin} = require('../../middlewares/auth')

//create
router.post('/product-category',[verifyAdmin], create)
//get all
router.get('/product-category',[verifyUserHandyManAdmin], getAll)
//get one
router.get('/product-category/:id',[verifyUserHandyManAdmin], getOne)
//update one
router.put('/product-category/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/product-category/:id',[verifyAdmin], deleteOne)

module.exports = router;