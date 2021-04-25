const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
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
    profile_picture:{
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
    deactivated_by: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    }
},{
    timestamps: true
})


module.exports = mongoose.model("User", userSchema)