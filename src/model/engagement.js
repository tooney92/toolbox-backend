const mongoose = require("mongoose")

const engagementSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
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
        type: String,
        required: true
    },
    userAccepted:{
        type: Boolean,
        default: true
    },
    handyManAccepted:{
        type: Boolean,
        default: false
    },
    serviceIssue:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "serviceIssues"
    },
    invoiceId:{
        type: mongoose.Schema.ObjectId,
        ref: "invoice"
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
    charge:{
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Engagement", engagementSchema)