const router = require('express').Router();
const serviceIssues = require("../model/serviceIssues")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")

module.exports.create = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            title: "required|minLength:5",
            serviceCategory: "required",
            serviceCharge: "required|integer",
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        req.body.created_by = req.user._id
        const newServiceIssues = new serviceIssues(req.body)
        let serviceIssuesData = await newServiceIssues.save()
        res.json({ serviceIssuesData })
    } catch (error) {
        logger.error(`route: /service-issues/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.getAll = async (req, res) => {
    try {
        let serviceIssuesData = await serviceIssues.find().populate('serviceCategory')
        res.json({ serviceIssuesData })
    } catch (error) {
        logger.error(`route: /service-issues/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}
module.exports.getOne = async (req, res) => {
    try {
        let serviceIssuesData = await serviceIssues.findOne({ _id: req.params.id }).populate('serviceCategory')
        if (!serviceIssuesData) {
            return res.status(404).send("service issue does not exist. Check Id")
        }
        return res.json({ serviceIssuesData })
    } catch (error) {
        logger.error(`route: /service-issues/, message - ${error.message}, stack trace - ${error.stack}`);
        console.log(error.code);
        res.status(500).send("unable to perform request")
    }
}

module.exports.updateOne = async (req, res) => {
    try {
        
        let updatedIssue = await serviceIssues.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, { new: true })
        if (!updatedIssue) {
            return res.status(404).send("unable to update. Check Id")
        }
        return res.json({ updatedIssue })
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.deleteOne = async (req, res) => {
    try {
        
        let info = await serviceIssues.findOneAndDelete({
            _id: req.params.id
        })
        if (!info) {
            return res.status(404).send("issue does not exist")
        }
        res.send("delete sucessful")
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}