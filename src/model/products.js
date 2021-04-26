const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    price:{
        type: Integer,
        default: 0
    },
    imageUrl:{
        type:String,
        default: null
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "productCategory"
    }
},{
    timestamps: true
})


module.exports = mongoose.model("Product", productSchema)