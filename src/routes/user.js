const router = require('express').Router();
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const logger = require('../../util/winston');
const {uuid} = require('uuidv4');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const webtoken = require("../../middlewares/auth")
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")

router.post('/user/signup', async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            fullName: "required",
            userName: "required",
            email: "required|email",
            gender: "required",
            password: "required",
            phoneNumber: "required"
        })

        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds)
        let user = new User(req.body)
        await user.save()

        user = _.omit(user, "password")
        //email
        res.json({user})

    } catch (error) {
        logger.error(`route: /users/signup, message - ${error.message}, stack trace - ${error.stack}`);
        if(error.code === 11000) return res.status(422).json({error: helper.duplicateMessageFormatter(error.keyPattern)})
        res.status(500).send("unable to perform request")
    }
})

router.get('/user/error', async(req, res)=>{
    try {
        // res.send("hello")
        throw new Error("exception occured")
    } catch (error) {
        logger.error(`route: /users/error, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send(`Our server is busy right now. Please try later.`)
    }
})

module.exports = router;