var mongoose = require("mongoose");

//We need to find a way to associate this comment with its appropriate user, so we modify the comments.js in the routes directory
//modify the Comment.create block in the route /campgrounds/:id/comments

var commentSchema = mongoose.Schema({
    text: String,
    // This is something we can only do with a non-relational database, otherwise we would have to store the ID only, then do lookup the username everytime
    //author is an object
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User" //ref refers to the model that we will refer-to with this object ID
        },
        username: String
    }
});


module.exports = mongoose.model("Comment",commentSchema);