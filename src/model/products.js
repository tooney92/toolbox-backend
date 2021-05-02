const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique: true
    },
    imageUrl:{
        type:String,
        unique: true
    },
    imageKey:{
        type:String,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "productCategory"
    },
    deleted: {
        type:Boolean,
        default: false
    }
},{
    timestamps: true
})


module.exports = mongoose.model("Product", productSchema)