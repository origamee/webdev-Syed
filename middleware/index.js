// all the middleware goes here
var Campground = require("../models/campgrounds")
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is user logged in
    //(we could use isLoggedIn but we're defining our own middleware here)
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCamp) {
            if (err) {
                res.redirect("back");
                console.log(err, " while finding campground in /campground/:id/edit route");
            } else {
                //does user own the campground
                //console.log(foundCamp.author.id); //this is a mongoose object
                //console.log(req.user._id); //this is a string
                //So rather than using == or === to compare, we use
                if (foundCamp.author.id.equals(req.user._id)) {
                    //res.render("campgrounds/edit", {valueInEditTemplate: foundCamp});
                    next(); //whatever code you have inside of the routehandler
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back"); //back to where the user came from
    }
};

//middleware to check if a user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //adding this line won't display anything for us, this is just specifying the key called "error" and the message associated with it
    req.flash("error", "Please Login First!"); //you do it before the redirect
    //now you need to handle the above flash req in /login for it to display, in the index.js file under the routes directory
    res.redirect("/login");
};

//I don't have authorizaiton around comments built in this project, I skipped that section
// middlewareObj.checkCommentOwnership = function() {
    
// };

module.exports = middlewareObj;