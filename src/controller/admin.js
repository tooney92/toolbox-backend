const router = require('express').Router();
const Admin = require("../model/admin")
const jwt = require("jsonwebtoken")
const logger = require('../../util/winston');
const {uuid} = require('uuidv4');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const webtoken = require("../../middlewares/auth")
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")

//add min password length
module.exports.create = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            fullName: "required",
            email: "required|email",
            password: "required"
        })

        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds)
        let admin = new Admin(req.body)
        await admin.save()

        //password is being sent, FIX
        admin = _.omit(admin.toObject(), ["password", "isOga"])
        //email
        res.json({admin})

    } catch (error) {
        logger.error(`route: /admins/signup, message - ${error.message}, stack trace - ${error.stack}`);
        if(error.code === 11000) return res.status(409).json({error: helper.duplicateMessageFormatter(error.keyPattern)})
        res.status(500).send("unable to perform request")
    }
}

//check admin exists and account is not deactivated or deleted.
module.exports.login = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            email: "required|email",
            password: "required",
        })
        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        const loginFields = {
            fullName: 1,
            email: 1,
            password: 1,
            createdAt: 1,
            isOga:1
        }
        let adminInfo = await Admin.findOne({email: req.body.email}, loginFields)
        if(!adminInfo){
            return res.status(404).send("user does not exist")
        }
        adminInfo = adminInfo.toObject()
        const matchPassword = await bcrypt.compare(req.body.password, adminInfo.password)
        if(!matchPassword){
            return res.status(401).json({error: "admin Password is Incorrect"})
        } 
        console.log(adminInfo);
        //jwt
        await jwt.sign({data: adminInfo}, process.env.token_secret, {expiresIn: 60 * 60 * 2}, (err, token) => {
            if(err) return res.status(500).json({message: "Token Could not be generated. Please try logging in again!"})
            adminInfo = _.omit(adminInfo, ["password", "isOga"])
            return res.status(200).json({
                adminInfo,
                token: token
            })
        })
    } catch (error) {
        logger.error(`route: /admins/error, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}