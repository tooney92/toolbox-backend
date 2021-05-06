const router = require('express').Router();
const Engagement = require("../model/engagement")
const handyMan = require("../model/handyman")
const serviceIssue = require("../model/serviceIssues")
const jwt = require("jsonwebtoken")
const logger = require('../../util/winston');
const {uuid} = require('uuidv4');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const helper = require("../../helpers/errorFormater")
const _ = require("lodash")


module.exports.create = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            handyMan: "required",
            serviceIssue: "required",
            serviceCharge: "required",
            userAddress: "required"
        })

        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        let handyManInfo = await handyMan.findOne({userName: req.body.handyMan})
        if(!handyManInfo){
            res.status(404).send("handy man does not exist. Check user name")
        }
        
        req.body.handyManId = handyManInfo._id
        req.body.userId = req.user._id
        req.body.userName = req.user.userName
        let info = {
            handyManId: req.body.handyManId,
            handyMan: req.body.handyMan,
            userId: req.user._id,
            userName: req.user.userName,
            serviceIssue: req.body.serviceIssue,
            userAddress: req.body.userAddress,
            serviceCharge: req.body.serviceCharge
        }

        let newEngagement = new Engagement(info)
        await newEngagement.save()
        return res.json({newEngagement})
        
    } catch (error) {
        logger.error(`route: /users/signup, message - ${error.message}, stack trace - ${error.stack}`);
        if(error.code === 11000) return res.status(422).json({error: helper.duplicateMessageFormatter(error.keyPattern)})
        res.status(500).send("unable to perform request")
    }
}

module.exports.get = async(req, res)=>{
    try {
        let fields = {
            _id: 1,
            userAccepted: 1,
            handyManAccepted: 1,
            completed: 1,
            paymentSuccessfull: 1,
            paystackId: 1,
            handyMan: 1,
            userName: 1,
            serviceIssue: 1,
            userAddress: 1,
            serviceCharge: 1,
            charge: 1
        }
        if(req.query.id == null || req.query.id == ""){
            let engagements = await Engagement.find({userId: req.user._id}, fields).populate('serviceIssue')
            return res.json({engagements})
        }
        let engagement = await Engagement.findOne({_id: req.query.id, userId: req.user._id}, fields).populate('serviceIssue')
        if(!engagement){
            return res.status(404).send('check Id')
        }
        return res.json({engagement})
    } catch (error) {
        logger.error(`route: /users, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}


// module.exports.delete = async (req, res) => {
//     try {

//         const v = new Validator(req.body, {
//             deactivated: "required"
//         })
//         const match = await v.check()
//         if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
//         let info = {deactivated: req.body.deactivated}
//         let updatedHandyMan = await User.findOneAndUpdate({
//             _id: req.user._id
//         }, {
//             $set: info
//         },
//             { new: true }
//         )
//         if (!updatedHandyMan) {
//             return res.status(404).send("unable to update. Check Id")
//         }
//         return res.send("user deactivated")
//     } catch (error) {
//         logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
//         res.status(500).send("unable to perform request")
//     }
// }
