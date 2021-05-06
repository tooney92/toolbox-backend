const mongoose = require("mongoose")

const serviceIssuesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
    imageKey: {
        type: String,
        required: true,
        unique: true
    },
    serviceCategory: {
        type: mongoose.Schema.ObjectId,
        ref: "serviceCategory"
    },
    serviceCharge: {
        type: Number,
        required: true
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("serviceIssues", serviceIssuesSchema)
