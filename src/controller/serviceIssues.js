const router = require('express').Router();
const serviceIssues = require("../model/serviceIssues")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")

module.exports.create = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            title: "required|minLength:5",
            serviceCategory: "required",
            serviceCharge: "required|integer",
        })
        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        req.body.created_by = req.user._id
        const newServiceIssues = new serviceIssues(req.body)
        let serviceIssuesData = await newServiceIssues.save()
        res.json({serviceIssuesData})
    } catch (error) {
        logger.error(`route: /service-issues/, message - ${error.message}, stack trace - ${error.stack}`);
        if(error.code === 11000) return res.status(422).json({error: helper.duplicateMessageFormatter(error.keyPattern)})
        res.status(500).send("unable to perform request")
    }
}

module.exports.getAll = async(req, res)=>{
    try {
        let serviceIssuesData = await serviceIssues.find().populate('serviceCategory')
        res.json({serviceIssuesData})
    } catch (error) {
        logger.error(`route: /service-issues/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}
module.exports.getOne = async(req, res)=>{
    try {
        let serviceIssuesData = await serviceIssues.findOne({_id: req.params.id}).populate('serviceCategory')
        res.json({serviceIssuesData})
    } catch (error) {
        logger.error(`route: /service-issues/, message - ${error.message}, stack trace - ${error.stack}`);
        console.log(error.code);
        res.status(500).send("unable to perform request")
    }
}