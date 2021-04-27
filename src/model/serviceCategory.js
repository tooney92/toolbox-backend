const mongoose = require("mongoose")

const serviceCategorySchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("serviceCategory", serviceCategorySchema)