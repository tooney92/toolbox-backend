const mongoose = require("mongoose")

const engagementSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    userAddress: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    handyMan: {
        type: String,
        required: true
    },
    handyManId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "handyMan"
    },
    userAccepted:{
        type: Boolean,
        default: true
    },
    handyManAccepted:{
        type: Boolean,
        default: false
    },
    handyManDeclined:{
        type: Boolean,
        default: false
    },
    userDeclined:{
        type: Boolean,
        default: false
    },
    serviceIssue:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "serviceIssues"
    },
    invoice:{
        type: mongoose.Schema.ObjectId,
        ref: "Invoice",
        default: null
    },
    completed:{
        type: Boolean,
        default: false
    },
    paymentSuccessfull:{
        type: Boolean,
        default: false
    },
    paystackId:{
        type: String,
        default: null
    },
    serviceCharge:{
        type: Number,
        required: true
    },
    productCharge:{
        type: Number,
        default: 0
    },
    deleted:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Engagement", engagementSchema)