const mongoose = require("mongoose")

const serviceCategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    },
    issues: [
        {
            type: String
        }
    ]
}, {
    timestamps: true
})


module.exports = mongoose.model("serviceCategory", serviceCategorySchema)