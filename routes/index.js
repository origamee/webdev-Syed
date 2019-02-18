var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//ROOT route
router.get('/', function(req, res) {
    res.render("landing");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//AUTH ROUTES
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get("/register", function(req, res) {
   res.render("register"); 
});

//handle sign up logic
//we create the user first, then use passport.authenticate so we can log the user in after it gets created
router.post("/register", function(req, res) {
   //this is provided by passport-local-mongoose
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, returnUser) {
      if (err) {
        console.log(err + " while registering a user in /register POST route"); 
        // Handle the error
        return res.render("register");
      } 
      passport.authenticate("local")(req, res, function(){ 
         res.redirect("/campgrounds"); 
      });
   });
});

//show login form
router.get("/login", function(req, res) {
    // IF you implement flash like this, you will have to to <% message %> in every EJS template that requires it
    // so in app.js, define message as res.locals, to avoid doing this in every template
    //res.render("login", {message: req.flash("error")}); //use the key "error", the error actually renders itself alongwith the login page
    res.render("login"); //message is available here as it's defined in app.js
})

//handling login logic, introduce middleware. Since its a 2nd argument, it will run before the callback
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
}), function(req, res) {    //we don't have to have a callback if we don't want to
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;
