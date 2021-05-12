const router = require('express').Router();
const handyManModel = require("../model/handyman")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")
const saltRounds = 10;
const jwt = require("jsonwebtoken")
const awsS3Helper = require('../../helpers/awsS3Upload')

const mimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif'
]

let fileErrMsg = "invalid file format. Only png, jpg, jpeg, gif allowed"

//refactor s3 dup issue
module.exports.create = async (req, res) => {
    try {

        if (req.files == null || !mimeTypes.includes(req.files.upload.mimetype)) {
            return res.status(400).send(req.files == undefined ? "please attach file" : fileErrMsg)
        }
        const v = new Validator(req.body, {
            fullName: "required",
            bankAccNum: "required",
            bank: "required",
            gender: "required",
            email: "required",
            password: "required",
            dob: "required",
            userName: "required",
            phoneNumber: "required",
            primaryArea1: "required",
            primaryArea2: "required",
            serviceCategory: "required",
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        let fileData =  await awsS3Helper.s3Upload(req.files.upload)
        req.body.profilePicture = fileData.data.Location
        req.body.ImageKey = fileData.data.Key
        req.body.created_by = req.user._id
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds)
        let handyMan = new handyManModel(req.body)
        handyMan = await handyMan.save()
        let info = _.omit(handyMan.toObject(), ["created_by", "imageKey", "deactivated_by", "created_by", "engaged", "deleted ", "deactivated"])
        res.json({ handyMan })
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

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
            bankAccNum: 1,
            bank: 1,
            gender: 1,
            email: 1,
            password: 1,
            dob: 1,
            userName: 1,
            phoneNumber: 1,
            primaryArea1: 1,
            primaryArea2: 1,
            primaryArea3: 1,
            profilePicture: 1,
            deactivated: 1,
            deleted: 1,
            engaged: 1,
            isHandyMan: 1,
            wallet: 1,
            serviceCategory: 1,
            created_by: 1
        }
        let handyManInfo = await handyManModel.findOne({email: req.body.email, deactivated: false, deleted:false}, loginFields)
        if(!handyManInfo){
            return res.status(404).send("user email or does not exist")
        }
        handyManInfo = handyManInfo.toObject()
        const matchPassword = await bcrypt.compare(req.body.password, handyManInfo.password)
        if(!matchPassword){
            return res.status(401).json({error: "user email or does not exist"})
        } 
        
        handyManInfo = _.omit(handyManInfo, ["password", "deactivated", "deleted", "deactivated_by", "created_by"])
        //jwt
        await jwt.sign({data: handyManInfo}, process.env.token_secret, {expiresIn: 60 * 60 * 2}, (err, token) => {
            if(err) return res.status(500).json({message: "Token Could not be generated. Please try logging in again!"})
            return res.status(200).json({
                handyManInfo: {
                    fullName: handyManInfo.fullName,
                    bankAccNum: handyManInfo.bankAccNum,
                    bank: handyManInfo.bank,
                    gender: handyManInfo.gender,
                    email: handyManInfo.email,
                    dob: handyManInfo.dob,
                    userName: handyManInfo.userName,
                    phoneNumber: handyManInfo.phoneNumber,
                    primaryArea1: handyManInfo.primaryArea1,
                    primaryArea2: handyManInfo.primaryArea2,
                    primaryArea3: handyManInfo.primaryArea3,
                    profilePicture: handyManInfo.profilePicture,
                    engaged: handyManInfo.engaged,
                    wallet: handyManInfo.wallet,
                    serviceCategory: handyManInfo.serviceCategory,
                },
                token: token
            })
        })
    } catch (error) {
        logger.error(`route: /users/error, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const fields = {
            fullName: 1,
            _id:0,
            bankAccNum: 1,
            bank: 1,
            gender: 1,
            email: 1,
            dob: 1,
            userName: 1,
            phoneNumber: 1,
            primaryArea1: 1,
            primaryArea2: 1,
            serviceCategory: 1,
            profilePicture: 1,
        }

        if(req.query.categoryId == null || req.query.categoryId == ""){
            let handyMen = await handyManModel.find({},fields).populate('serviceCategory')
            return res.json({ handyMen })
        }
        let handyMen = await handyManModel.find({serviceCategory: req.query.categoryId},fields).populate('serviceCategory')
        return res.json({ handyMen })
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        console.log(error);
        res.status(500).send("unable to perform request")
    }
}

module.exports.getOne = async (req, res) => {
    try {
        const fields = {
            fullName: 1,
            _id:0,
            bankAccNum: 1,
            bank: 1,
            gender: 1,
            email: 1,
            dob: 1,
            userName: 1,
            phoneNumber: 1,
            primaryArea1: 1,
            primaryArea2: 1,
            profilePicture: 1,
        }
        let handyMan = await handyManModel.findOne({ userName: req.params.id },fields).populate('serviceCategory')
        if (!handyMan) {
            return res.status(404).send("handy man does not exist. Check Id")
        }
        return res.json({ handyMan })
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.updateOne = async (req, res) => {
    try {

        let data = req.body
        data  = _.omit(data, ["wallet", "deactivated_by", "created_by", "imageKey", "engaged", "profilePicture", "delete", "deactivated"])
        let updatedHandyMan = await handyManModel.findOneAndUpdate({
            userName: req.params.id
        }, {
            $set: data
        },
            { new: true }
        )
        if (!updatedHandyMan) {
            return res.status(404).send("unable to update. Check Id")
        }
        updatedHandyMan = _.omit(updatedHandyMan.toObject(), ["_id", "password", "created_by"])
        return res.json({updatedHandyMan})
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.handyManUpdate = async (req, res) => {
    try {

        let data = req.body
        data  = _.omit(data, ["wallet", "deactivated_by", "created_by", "imageKey", "engaged", "profilePicture", "deleted", "deactivated"])
        let updatedHandyMan = await handyManModel.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: data
        },
            { new: true }
        )
        if (!updatedHandyMan) {
            return res.status(404).send("unable to update. Check Id")
        }
        updatedHandyMan = _.omit(updatedHandyMan.toObject(), ["_id", "password", "created_by", "deactivated_by", "imageKey"])
        return res.json({updatedHandyMan})
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
        let updatedHandyMan = await handyManModel.findOneAndUpdate({
            userName: req.params.id
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
