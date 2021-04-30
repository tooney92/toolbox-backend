const router = require('express').Router();
const productCategory = require("../model/productCategory")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")

module.exports.create = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            title: "required",
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        req.body.created_by = req.user._id
        req.body.title = req.body.title.toLowerCase()
        let newProductCategory = new productCategory(req.body)
        newProductCategory = await newProductCategory.save()
        res.json({ newProductCategory })
    } catch (error) {
        logger.error(`route: /product-category/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const fields = {
            created_by: 0
        }
        let categories = await productCategory.find({deleted: false}, fields)
        res.json({ categories })
    } catch (error) {
        logger.error(`route: /product-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.getOne = async (req, res) => {
    try {
        const fields = {
            created_by: 0
        }
        let category = await productCategory.findOne({ _id: req.params.id, deleted: false }, fields)
        if (!category) {
            return res.status(404).send("Category does not exist. Check Id")
        }
        return res.json({ category })
    } catch (error) {
        logger.error(`route: /product-category/, message - ${error.message}, stack trace - ${error.stack}`);
        return res.status(500).send("unable to perform request")
    }
}

module.exports.updateOne = async (req, res) => {
    try {
        
        const info = _.omit(req.body, ["created_by"])
        let updatedCategory = await productCategory.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: info
        },
            { new: true }
        )
        if (!updatedCategory) {
            return res.status(404).send("unable to update. Check Id")
        }
        updatedCategory = _.omit(updatedCategory.toObject(), ["created_by"])
        return res.json({ updatedCategory })
    } catch (error) {
        logger.error(`route: /product-category/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.deleteOne = async (req, res) => {
    try {

        const v = new Validator(req.body, {
            deleted: "required"
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        let info = {deleted: req.body.deleted}
        let deletedCategory = await productCategory.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: info
        },
            { new: true }
        )
        if (!deletedCategory) {
            return res.status(404).send("unable to update. Check Id")
        }
        return res.send("category deleted")
    } catch (error) {
        logger.error(`route: /product-category/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}