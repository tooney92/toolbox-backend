const mongoose = require("mongoose")

const handyManSchema = mongoose.Schema({
    fullName:{
        type:String,
        required: true
    },
    bankAccNum:{
        type:String,
        unique: true
    },
    bank:{
        type:String,
        required: true
    },
    gender:{
        type:String,
        required: true,
        enum: ['male', 'female']
    },
    email: {
        type: String,
        required: true,
        unique: true  
    },
    password: {
        type: String,
        required: true  
    },
    dob: {
        type: Date,
        default: null
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: String
    },
    primaryArea1:{
        type: String
    },
    primaryArea2:{
        type: String
    },
    primaryArea3:{
        type: String
    },
    profilePicture:{
        type: String,
        default:null
    },
    ImageKey:{
        type: String,
        default:null
    },
    deactivated: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    engaged: {
        type: Boolean,
        default: false
    },
    isHandyMan: {
        type: Boolean,
        default: true
    },
    wallet: {
        type: Number,
        default: 0
    },
    serviceCategory: {
        type: mongoose.Schema.ObjectId,
        ref: "serviceCategory"
    },
    deactivated_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    }
},{
    timestamps: true
})


module.exports = mongoose.model("handyMan", handyManSchema)