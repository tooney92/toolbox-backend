const router = require('express').Router();
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const logger = require('../../util/winston');
const {uuid} = require('uuidv4');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")


module.exports.signUp = async(req, res)=>{
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

        //password is being sent, FIX

        user = _.omit(user.toObject(), ["password", "deactivated", "deleted", "_id", "deactivated_by", "isUser"])
        //email
        res.json({user})

    } catch (error) {
        logger.error(`route: /users/signup, message - ${error.message}, stack trace - ${error.stack}`);
        if(error.code === 11000) return res.status(422).json({error: helper.duplicateMessageFormatter(error.keyPattern)})
        res.status(500).send("unable to perform request")
    }
}

//check user exists and account is not deactivated or deleted.
module.exports.login = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            email: "required|email",
            password: "required",
        })
        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        const loginFields = {
            profile_picture: 1,
            deactivated: 1,
            deleted: 1,
            fullName: 1,
            userName: 1,
            email: 1,
            gender: 1,
            password: 1,
            phoneNumber: 1,
            createdAt: 1,
            isUser: 1,
        }
        let userInfo = await User.findOne({email: req.body.email}, loginFields)
        userInfo = userInfo.toObject()
        const matchPassword = await bcrypt.compare(req.body.password, userInfo.password)
        if(!matchPassword){
            return res.status(401).json({error: "User Password is Incorrect"})
        } 
        if(userInfo.deactivated || userInfo.deleted){
            return res.status(401).send({error: userInfo.deleted ? "account deleted, contact admin" : "account deactivated contact admin"})
        }
        userInfo = _.omit(userInfo, ["password", "deactivated", "deleted", "deactivated_by"])
        //jwt
        await jwt.sign({data: userInfo}, process.env.token_secret, {expiresIn: 60 * 60 * 2}, (err, token) => {
            if(err) return res.status(500).json({message: "Token Could not be generated. Please try logging in again!"})
            delete userInfo._id
            return res.status(200).json({
                userInfo,
                token: token
            })
        })
    } catch (error) {
        logger.error(`route: /users/error, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.getUser = async(req, res)=>{
    try {
        const fieldKeys = {
            password:0,
            _id:0,
            deactivated_by:0, 
            deleted:0, 
            deactivated:0, 
            password:0, 
        }
        const user = await User.findOne({_id: req.user._id}, {fieldKeys})
        if (!user) {
            res.status(404).send("user does not exist.")
        }
        res.json({user})
    } catch (error) {
        logger.error(`route: /users, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.updateUser = async (req, res) => {
    try {

        let data = req.body
        data  = _.omit(data, ["deactivated_by", "deleted", "deactivated", "password", "profile_picture", "_id", "isUser"])
        let updatedUser = await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: data
        },
            { new: true }
        )
        if (!updatedUser) {
            return res.status(404).send("unable to update. Check Id")
        }
        updatedUser = _.omit(updatedUser.toObject(), ["deactivated_by", "deleted", "deactivated", "password", "profile_picture", "_id"])
        return res.json({updatedUser})
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.deactivate = async (req, res) => {
    try {

        const v = new Validator(req.body, {
            deactivated: "required"
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        let info = {deactivated: req.body.deactivated}
        let updatedHandyMan = await User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: info
        },
            { new: true }
        )
        if (!updatedHandyMan) {
            return res.status(404).send("unable to update. Check Id")
        }
        return res.send("user deactivated")
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}
