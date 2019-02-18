var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comments");

//A user should only be able to add new comments if he/she is logged in
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    //we already have a new.ejs template for campgrounds/new, so we need to split the views directory and make two new directories i.e. campgrounds and comments
    //res.render("new");
    //find campground by ID and send that ID to render
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err + " while finding campground in the /campground/:id/comments/new route");
        } else {
            res.render("comments/new", {valueInNewCommentsTemplate: foundCamp});
        }
    });
});

//isLoggedIn will prevent anyone from just sending a POST request directly by using e.g. Postman to add a comment
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    //lookup campground using ID
    //create new comment
    //connect new comment to campground
    //redirect back to show page of the same campground's show page
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err + " while finding campground in the campgrounds/:id/comments POST route");
            res.redirect("/campgrounds");
        } else {
            console.log(req.body.comment); //this brings back the entire variable, so we don't have to define variables like in the /campgrounds POST route
            Comment.create(req.body.comment, function(err, newlyCreated) {
                if (err) {
                    console.log(err + " while creating comment in the /campgrounds/:id/comments POSt route");
                } else {
                    //specific to v8
                    //add username and id to comment
                    //this block will only work if the user is logged in, because of the middleware in place
                    // comment has author and author has ID, based on the schema we've defined
                    newlyCreated.author.id = req.user._id;
                    newlyCreated.author.username = req.user.username;
                    //save comment
                    newlyCreated.save(); //now modify the show template for campgrounds in /views/ to show the username only <strong><%= commentinside.author.username %></strong>
                    //associate comment to campground
                    foundCamp.comments.push(newlyCreated);
                    foundCamp.save();
                    //render the SHOW page which is already defined up in the code
                    res.redirect("/campgrounds/" + foundCamp._id); //concatenate with the ID for rendering the SHOW page
                }
            });
        }
    });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;