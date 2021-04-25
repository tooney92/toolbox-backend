const mongoose = require("mongoose")

const transactionSchema = mongoose.Schema({
    amount: {
        type: Integer,
        required: true
    },
    paystackId: {
        type: String,
        required: true
    },
    successful: {
        type: Boolean,
        required: true
    },
    engagementId: {
        type: mongoose.Schema.ObjectId,
        ref: "engagementId"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Transaction", transactionSchema)