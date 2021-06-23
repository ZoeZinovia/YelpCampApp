//Schema Setup Campgrounds

var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    creator: {
        id: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    createdDate: {
        type: Date,
        default: Date.now(),
        ref: "creationDate"
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);