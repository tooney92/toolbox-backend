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
const _ = require("lodash");
const handyman = require('../model/handyman');



module.exports.get = async (req, res) => {
    try {

        let fields = {
            wallet: 1,
            _id: 0
        }

        let wallet = await handyMan.findOne({ _id: req.user._id, deleted: false, deactivated: false }, fields)
        if (!wallet) {
            return res.status(400).send('unable to process request')
        }
        wallet = wallet.toObject()
        return res.json(wallet)
    } catch (error) {
        logger.error(`route: /handyMan-engagements, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}

module.exports.withdraw = async (req, res) => {
    try {

        const v = new Validator(req.body, {
            amount: "required|integer"
        })

        const match = await v.check()
        if (!match) return res.status(422).json({ error: helper.vErrorsMessageFormatter(v.errors) })

        let fields = {
            wallet: 1
        }
        let handyManWallet = await handyMan.findOne({ _id: req.user._id, deleted: false, deactivated: false }, fields)
        if (!handyManWallet) {
            return res.status(404).send('check Id')
        }
        handyManWallet = handyManWallet.toObject()
        if (Number(handyManWallet.wallet) < Number(req.body.amount)) {
            return res.status(400).send("cannot withdraw more than available balance")
        }


        let balance = Number(handyManWallet.wallet) - Number(req.body.amount)
        let handymanWalletUpdated = await handyman.findOneAndUpdate({
            _id: req.user._id, deleted: false, deactivated: false
        }, {
            $set: {
                wallet: balance
            }
        }, { new: true })
        if (handymanWalletUpdated.nModified == 0) {
            return res.status(400).send("unable to perform request")
        }

        return res.json({
            wallet: handymanWalletUpdated.wallet
        })
    } catch (error) {
        logger.error(`route: /handyMan-engagements, message - ${error.message}, stack trace - ${error.stack}`);
        res.status(500).send("unable to perform request")
    }
}
