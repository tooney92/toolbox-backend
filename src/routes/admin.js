const router = require('express').Router();
const {create, login} = require("../controller/admin")

router.post('/admin/create', create) 

router.post('/admin/login', login)

// router.post('/admin/handyMan', login)
// router.post('/admin/log', login)
// router.post('/admin/login', login)


module.exports = router;