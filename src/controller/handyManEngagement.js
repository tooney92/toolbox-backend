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



module.exports.get = async (req, res) => {
    try {
        
        let fields = {
            userAccepted: 1,
            handyManAccepted: 1,
            handyManDeclined: 1,
            completed: 1,
            paymentSuccessfull: 1,
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

            let engagements = await Engagement.find({handyManId: req.user._id, deleted: false}, fields).populate('userId serviceIssue invoice')
            if (engagements.length < 1) {
                return res.json({ engagements: [] })
            }
            engagements = engagements.map((engagement) => {

                engagement = engagement.toObject()
                engagement = _.omit(engagement, ["handyManId"])
                engagement.invoice = _.omit(engagement.invoice, ["user", "created_by"])

                engagement.userId = {
                    fullName: engagement.userId.fullName,
                    profilePicture: engagement.userId.profilePicture,
                    gender: engagement.userId.gender,
                    email: engagement.userId.email,
                    phoneNumber: engagement.userId.phoneNumber,
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
            return res.json(engagements)
        }
        let engagement = await Engagement.findOne({ _id: req.query.id, handyManId: req.user._id, deleted: false }, fields).populate('userId serviceIssue invoice')
        if (!engagement) {
            return res.status(404).send('check Id')
        }

        engagement = engagement.toObject()
        engagement.invoice = _.omit(engagement.invoice, ["user", "created_by"])
        engagement.userId = {
            fullName: engagement.userId.fullName,
            userName: engagement.userId.userName,
            profilePicture: engagement.userId.profilePicture,
            gender: engagement.userId.gender,
            email: engagement.userId.email,
            phoneNumber: engagement.userId.phoneNumber,
        }
        engagement.serviceIssue = {
            _id: engagement.serviceIssue._id,
            title: engagement.serviceIssue.title,
            serviceCategory: engagement.serviceIssue.serviceCategory,
            serviceCharge: engagement.serviceIssue.serviceCharge,
            imageUrl: engagement.serviceIssue.imageUrl,
        }
        return res.json(engagement)
    } catch (error) {
        logger.error(`route: /handyMan-engagements, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.accept = async(req, res)=>{
    try {
        
       let handyManengagement = await Engagement.updateOne({
           _id: req.params.engagementId, handyManId: req.user._id, deleted: false, handyManDeclined: false
        },{
            $set: {
                handyManAccepted: true
            }
        },{ 
            new: true 
        })
        if(handyManengagement.nModified == 0){
            return res.status(404).send("unable to perform request. check Id")
        }
        return res.send("Engagement accepted")
    } catch (error) {
        logger.error(`route: /handyMan-engagements, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.decline = async(req, res)=>{
    try {
        let data = {
            handyManDeclined: true
        }
        let handyManengagement = await Engagement.updateOne({
            _id: req.params.engagementId, handyManId: req.user._id, deleted: false, handyManAccepted: false
         },{
             $set: data
         },{ 
             new: true 
         })
         if(handyManengagement.nModified == 0){
             return res.status(404).send("unable to perform request. check Id")
         }
         console.log(handyManengagement);
         return res.send("Engagement declined")
     } catch (error) {
         logger.error(`route: /handyMan-engagements, message - ${error.message}, stack trace - ${error.stack}`);
         res.status(500).send("unable to perform request")
     }
}

//cannot decline after accepting
