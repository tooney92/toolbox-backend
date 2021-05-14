const router = require('express').Router();
const Engagement = require("../model/engagement")
const Invoice = require("../model/invoice")
const serviceIssue = require("../model/serviceIssues")
const jwt = require("jsonwebtoken")
const logger = require('../../util/winston');
const { uuid } = require('uuidv4');
const { Validator } = require('node-input-validator')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const helper = require("../../helpers/errorFormater")
const _ = require("lodash");
const { reduce } = require('lodash');


module.exports.create = async (req, res) => {
    try {
        const v = new Validator(req.body, {
            engagementId: "required",
            products: "required|array"
        })

        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })
        let handyManEngagement = await Engagement.findOne({ _id: req.body.engagementId, handyManId: req.user._id })
        if (!handyManEngagement) {
            res.status(404).send("engagement Id does not exist")
        }

        const reducer = (accumulator, item) => {
            return accumulator + (Number(item.price) * Number(item.quantity));
        };
        req.body.created_by = req.user._id
        req.body.user = handyManEngagement.userId
        req.body.amount = req.body.products.reduce(reducer, 0)
        req.body = _.omit(req.body, ["userAccepted"])
        let newInvoice = new Invoice(req.body)
        newInvoice = await newInvoice.save()
        let updateEngagement = await Engagement.findOneAndUpdate({
            _id: handyManEngagement._id, handyManId: req.user._id
        },{
            $set: {
                invoice: newInvoice._id
            }
        })
        return res.send(newInvoice)

    } catch (error) {
        logger.error(`route: /invoice, message - ${error.message}, stack trace - ${error.stack}`);
        if (error.code === 11000) return res.status(422).json({ error: helper.duplicateMessageFormatter(error.keyPattern) })
        res.status(500).send("unable to perform request")
    }
}

module.exports.get = async (req, res) => {
    try {
        let fields = {
            created_by: 0
        }
        if (req.query.id == null || req.query.id == "") {

            let invoices = await Invoice.find({ created_by: req.user._id }, fields).populate('engagementId')
            if (invoices.length < 1) {
                return res.json({ invoices: [] })
            }

            invoices = invoices.map((invoice) => {

                invoice = invoice.toObject()

                invoice.engagementId = _.pick(invoice.engagementId, ["completed", "productCharge", "_id", "handyMan", "userName", "serviceIssue", "userAddress", "serviceCharge"])
                return invoice
            })
            return res.json(invoices)
        }
        let invoice = await Invoice.findOne({ _id: req.query.id, created_by: req.user._id }, fields).populate('engagementId serviceIssue')
        if (!invoice) {
            return res.status(404).send('check Id')
        }

        invoice = _.omit(invoice.toObject(), ["user"])
        invoice.engagementId = _.pick(invoice.engagementId, ["completed", "productCharge", "_id", "handyMan", "userName", "serviceIssue", "userAddress", "serviceCharge"])
        return res.json(invoice)
    } catch (error) {
        logger.error(`route: /invoice, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.update = async (req, res) => {
    try {

        const v = new Validator(req.body, {
            products: "required|array"
        })

        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })

        const reducer = (accumulator, item) => {
            return accumulator + Number(item.price);
        };
        let newAmount = req.body.products.reduce(reducer, 0)
        let data = { products: req.body.products, amount: newAmount }
        let updateInvoice = await Invoice.findOneAndUpdate({
            created_by: req.user._id, _id: req.params.invoiceId, userAccepted: false
        }, {
            $set: data
        }, { new: true })

        if (!updateInvoice) {
            return res.status(400).send("unable to perform request")
        }
        updateInvoice = _.pick(updateInvoice, ["_id", "amount", "engagementId", "createdAt", "products", "userAccepted"])
        return res.send(updateInvoice)
    } catch (error) {
        logger.error(`route: /invoice, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.acceptInvoice = async (req, res) => {
    try {

        let data = { userAccepted: true }
        let updatedInvoice = await Invoice.findOneAndUpdate({
            user: req.user._id, _id: req.params.invoiceId, userAccepted: false, userDeclined: false
        }, {
            $set: data
        }, { new: true })

        if (!updatedInvoice) {
            return res.status(400).send("unable to perform request")
        }
        updatedInvoice = _.pick(updateInvoice, ["_id", "amount", "engagementId", "createdAt", "products", "userAccepted"])
        return res.send(updatedInvoice)
    } catch (error) {
        logger.error(`route: /invoice, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.declineInvoice = async (req, res) => {
    try {

        let data = { userDeclined: true }
        let updatedInvoice = await Invoice.findOneAndUpdate({
            user: req.user._id, _id: req.params.invoiceId, userAccepted: false, userDeclined: false
        }, {
            $set: data
        }, { new: true })

        if (!updatedInvoice) {
            return res.status(400).send("unable to perform request")
        }
        updatedInvoice = _.pick(updateInvoice, ["_id", "amount", "engagementId", "createdAt", "products", "userAccepted", "userDeclined"])
        return res.send(updatedInvoice)
    } catch (error) {
        logger.error(`route: /invoice, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

