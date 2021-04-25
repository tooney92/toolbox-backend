const mongoose = require("mongoose")

const productCategorySchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    linked: {
        type: Boolean,
        default: false
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    }
},{
    timestamps: true
})


module.exports = mongoose.model("productCategory", productCategorySchema)