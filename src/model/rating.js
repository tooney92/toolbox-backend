const mongoose = require("mongoose")

const ratingSchema = mongoose.Schema({
    handyMan: {
        type: mongoose.Schema.ObjectId,
        ref: "handyMan"
    },
    rating: [
        {
            type: Integer
        }
    ]
}, {
    timestamps: true
})


module.exports = mongoose.model("Rating", ratingSchema)