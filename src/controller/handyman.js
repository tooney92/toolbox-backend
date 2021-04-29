const router = require('express').Router();
const handyManModel = require("../model/handyman")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")

module.exports.create = async (req, res) => {
    try {
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
            serviceCategory: "required"
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        req.body.created_by = req.user._id
        let handyMan = new handyManModel(req.body)
        handyMan = await handyMan.save()
        res.json({ handyMan })
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
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
            created_by: 0
        }
        let handyMen = await handyManModel.find({},fields).populate('serviceCategory')
        res.json({ handyMen })
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
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
            serviceCategory: 1,
            created_by: 0
        }
        let handyMan = await handyManModel.findOne({ userName: req.params.id },fields).populate('serviceCategory')
        res.json({ handyMan })
    } catch (error) {
        logger.error(`route: /admin-handyMan/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.updateOne = async (req, res) => {
    try {

        let data = req.body
        data  = _.omit(data, ["wallet", "profile_picture", "engaged"])
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
