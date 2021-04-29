const router = require('express').Router();
const {create, getAll, getOne, updateOne, deleteOne} = require('../controller/products')
const {verifyAdmin} = require('../../middlewares/auth')

//create
router.post('/products',[verifyAdmin], create)
//get all
router.get('/products',[verifyAdmin], getAll)
//get one
router.get('/products/:id',[verifyAdmin], getOne)
//update one
router.put('/products/:id',[verifyAdmin], updateOne)
//delete one
router.delete('/products/:id',[verifyAdmin], deleteOne)


module.exports = router;