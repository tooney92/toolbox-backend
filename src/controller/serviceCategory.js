const router = require('express').Router();
const serviceCategory = require("../model/serviceCategory")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")


module.exports.create = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            title: "required|minLength:3",
        })
        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        req.body.created_by = req.user._id
        const newServiceCategory = new serviceCategory(req.body)
        let info = await newServiceCategory.save()
        res.json({info})
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        if(error.code === 11000) return res.status(422).json({error: helper.duplicateMessageFormatter(error.keyPattern)})
        res.status(500).send("unable to perform request")
    }
}

module.exports.getAll = async(req, res)=>{
    try {
        let info = await serviceCategory.find()
        res.json({info})
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.getOne = async(req, res)=>{
    try {
        let info = await serviceCategory.findOne({_id: req.params.id})
        res.json({info})
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.updateOne = async(req, res)=>{
    try {
        const v = new Validator(req.body,{
            title: "required|minLength:3",
        })
        console.log(req.body);
        const match = await v.check()
        if(!match) return res.status(422).json({error:  helper.vErrorsMessageFormatter(v.errors)})
        let updatedCategory = await serviceCategory.findOneAndUpdate({
            _id: req.params.id
        },{
            $set:req.body
        })
        if(!updatedCategory){
            return res.status(422).send("unable to update. Check Id")
        }
        return res.json({updatedCategory})
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.deleteOne = async(req, res)=>{
    try {
        
        let info = await serviceCategory.findOneAndDelete({
            _id: req.params.id
        })
        if(!info){
            return res.status(404).send("category does not exist")
        }
        res.send("delete sucessful")
    } catch (error) {
        logger.error(`route: /service-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}