const mongoose = require("mongoose")

const invoiceSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    userAccepted: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "handyMan"
    },
    engagementId: {
        type: mongoose.Schema.ObjectId,
        ref: "Engagement"
    },
    products: [{
        type: Object
    }]
}, {
    timestamps: true
})


module.exports = mongoose.model("Invoice", invoiceSchema)