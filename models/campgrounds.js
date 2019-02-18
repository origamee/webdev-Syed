var mongoose = require("mongoose");

/// define schema////
var campgroundSchema = new mongoose.Schema({
    name : String,
    price: String, //add new value, modify the new, edit and show templates. Then modify the POST route to allow to write this new value to the DB 
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    //following the object reference model, just embedding an ID or reference to the comments. Not the actual comments
    //this is an array of comment ID's
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" //this is the name of the Comment model in comments.js
        }
    ]
});

//use module.exports to return this model to all the files who will use this model.....by importing
module.exports = mongoose.model("Campground", campgroundSchema);