const router = require('express').Router();
const Product = require("../model/products")
const logger = require('../../util/winston');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const helper = require("../../helpers/errorFormater")
const _ = require("lodash")


module.exports.create = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            title: "required|minLength:3",
            price: "required|integer",
            category: "required"
        })
        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        req.body.created_by = req.user._id
        const newProduct = new Product(req.body)
        let info = await newProduct.save()
        info = _.omit(info.toObject(), ["created_by"])
        res.json({ product: info })
    } catch (error) {
        logger.error(`route: /products/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const fields = {
            created_by: 0
        }
        let products = await Product.find({deleted: false}, fields).populate('category')
        res.json({ products })
    } catch (error) {
        logger.error(`route: /products/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.getOne = async (req, res) => {
    try {
        const fields = {
            created_by: 0
        }
        let product = await Product.findOne({ _id: req.params.id }, fields).populate('category')
        if (!product) {
            return res.status(404).send("product does not exist. Check Id")
        }
        res.json({ product })
    } catch (error) {
        logger.error(`route: /products/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.updateOne = async (req, res) => {
    try {
        
        const info = _.omit(req.body, ["imageUrl", "created_by"])
        let updatedProduct = await Product.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: info
        },
            { new: true },
        )
        if (!updatedProduct) {
            return res.status(404).send("unable to update. Check Id")
        }
        updatedProduct = _.omit(updatedProduct.toObject(), ["created_by"])
        return res.json({ updatedProduct })
    } catch (error) {
        logger.error(`route: /products/, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(409).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.deleteOne = async (req, res) => {
    try {

        let info = await Product.findOneAndDelete({
            _id: req.params.id
        })
        if (!info) {
            return res.status(404).send("product does not exist")
        }
        res.send("delete sucessful")
    } catch (error) {
        logger.error(`route: /products/, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}