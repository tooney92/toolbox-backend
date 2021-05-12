const router = require('express').Router();
const Engagement = require("../model/engagement")
const handyMan = require("../model/handyman")
const serviceIssue = require("../model/serviceIssues")
const jwt = require("jsonwebtoken")
const logger = require('../../util/winston');
const { uuid } = require('uuidv4');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const helper = require("../../helpers/errorFormater")
const _ = require("lodash")


module.exports.create = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            handyMan: "required",
            serviceIssue: "required",
            serviceCharge: "required",
            userAddress: "required"
        })

        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        let handyManInfo = await handyMan.findOne({ userName: req.body.handyMan })
        if (!handyManInfo) {
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

        let data = new Engagement(info)
        let newEngagement = await data.save()
        newEngagement = _.omit(newEngagement.toObject(), ["handyManId", "userId"])
        return res.json({ newEngagement })

    } catch (error) {
        logger.error(`route: /users/signup, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(422).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.get = async (req, res) => {
    try {
        let fields = {
            userAccepted: 1,
            handyManAccepted: 1,
            handyManDeclined: 1,
            completed: 1,
            paymentSuccessfull: 1,
            paystackId: 1,
            handyMan: 1,
            userName: 1,
            serviceIssue: 1,
            userAddress: 1,
            serviceCharge: 1,
            charge: 1,
            handyManId: 1,
            title: 1, 
            invoice: 1,
            productCharge: 1
        }
        if (req.query.id == null || req.query.id == "") {

            let engagements = await Engagement.find({userId: req.user._id, deleted: false}, fields).populate('handyManId serviceIssue invoiceId')
            if (engagements.length < 1) {
                return res.json({ engagements: [] })
            }
            engagements = engagements.map((engagement) => {

                engagement = engagement.toObject()

                engagement.handyManId = {
                    fullName: engagement.handyManId.fullName,
                    userName: engagement.handyManId.userName,
                    profilePicture: engagement.handyManId.profilePicture,
                    gender: engagement.handyManId.gender,
                    email: engagement.handyManId.email,
                    phoneNumber: engagement.handyManId.phoneNumber,
                }

                engagement.serviceIssue = {
                    _id: engagement.serviceIssue._id,
                    title: engagement.serviceIssue.title,
                    serviceCategory: engagement.serviceIssue.serviceCategory,
                    serviceCharge: engagement.serviceIssue.serviceCharge,
                    imageUrl: engagement.serviceIssue.imageUrl,
                }

                return engagement
            })
            // engagements.handyManId = _.omit(engagements.handyManId, ["profilePicture", "fullName"])
            return res.json({ engagements })
        }
        let engagement = await Engagement.findOne({ _id: req.query.id, userId: req.user._id, deleted: false }, fields).populate('handyManId serviceIssue')
        if (!engagement) {
            return res.status(404).send('check Id')
        }

        engagement = engagement.toObject()
        engagement.handyManId = {
            fullName: engagement.handyManId.fullName,
            userName: engagement.handyManId.userName,
            profilePicture: engagement.handyManId.profilePicture,
            gender: engagement.handyManId.gender,
            email: engagement.handyManId.email,
            phoneNumber: engagement.handyManId.phoneNumber,
        }
        engagement.serviceIssue = {
            _id: engagement.serviceIssue._id,
            title: engagement.serviceIssue.title,
            serviceCategory: engagement.serviceIssue.serviceCategory,
            serviceCharge: engagement.serviceIssue.serviceCharge,
            imageUrl: engagement.serviceIssue.imageUrl,
        }
        return res.json({ engagement })
    } catch (error) {
        logger.error(`route: /users, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}


module.exports.deleteOne = async (req, res) => {
    try {
        const deletedEngagement = await Engagement.deleteOne({_id: req.params.id, userId: req.user._id, handyManAccepted: false})
        if(deletedEngagement.n < 1){
            return res.status(400).send("unable to delete record. Check Id")
        }
        return res.send("engagement deleted")
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}
