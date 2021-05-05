const mongoose = require("mongoose")

const engagementSchema = mongoose.Schema({
    handyManId: {
        type: String,
        required: true
    },
    handyMan: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
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
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Engagement", engagementSchema)