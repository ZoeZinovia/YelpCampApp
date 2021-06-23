var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
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

module.exports = mongoose.model("Comment", commentSchema);
