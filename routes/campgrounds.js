//Here we won't declare the app variable like we did before
//Instead we will use the express router
//In this version, protect the POST /campgrounds and GET /campgrounds/new routes from somebody e.g. using POSTMAN
var express    = require("express");
var router     = express.Router();  //IF you're using reduced routes, change this to express.Router({mergeParams: true}); so req.params can accessed in campgrounds and comments etc etc.
var Campground = require("../models/campgrounds");
var middleware = require("../middleware"); //we don't need to do ../middleware/index.js, if you name a file index.js, it's implied, that's why we names the middleware file index.js

//INDEX ROUTE - shows all campgrounds
router.get('/campgrounds', function(req, res) {
    console.log(req.user); //This will display the user information, undefined if not login in, and an ID if logged in
    //move this OUTSIDE if you're not using a database
    // var campgrounds = [
    //     {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_960_720.jpg"},
    //     {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/11/29/04/17/bonfire-1867275_960_720.jpg"},
    //     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_960_720.jpg"}
    //     ]
        // We need to take the array above to the campgrounds page and render it there
        //res.render("campgrounds", {data: campgrounds});
        
        //Get all camogrounds from DB
        Campground.find({}, function(err, camp) {
            if (err) {
                console.log(err);
            } else {
                //pass currentUser to all routes that have the navbar, or there will be a reference error. We've used request.locals for this as a separate function
                res.render("campgrounds/index", {data: camp}); //assign data in the EJS file to be the returned value from this function i.e. camp
            }
        });
});

//same URL as for the get route, but they are different routes. It's conventianal to use the same name, RESTful convention.

//CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    //res.send("You are in the POST route"); 
    //Now get data from the the form and add to the campgrounds array
    // campName and campImage are the names of the variables inside the EJS template
    //Need to include bodyParser before accessing body
    var name = req.body.campName;
    var image = req.body.campImage;
    var desc = req.body.campDescription;
    var price = req.body.campPrice;
    //console.log(req.user); //req.user contains info on the currently loggin user. If not logged in, the value is NULL
    //just another way of declaring a variable (object), cleaner way
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, price: price, author: author};
    
    
    //Previously, we were pushing the newly created campground into the array here
    // Now we create the new campgrund in the DB
    //Method-1, use Campground.create()
    Campground.create(newCampground, function(err, newlyCreated) {
       if (err) {
           console.log(err + " in creating new campground in the DB");
       } else {
               //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds"); //default is to redirect to the GET route after putting new entry into the DB
       }
    });
});

// RESTful convention
//NEW ROUTE - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new"); //new.ejs
});

//SHOW ROUTE - show's info about a particular campground
//will work for anything specified AFTER /campgrounds....so it has to come after the /campgrounds/new route, ORDER matters....
router.get("/campgrounds/:id", function(req, res) {
    //res.send("This will be a SHOW page one day");
    //This findById will not show the comments
    //Campground.findById(req.params.id, function(err, foundCamp) {
    //If we need to show the comments alongwith the picture, we need to use .populate.exec
    //find the campground, populate comments next to the capground, and excute the query under .exec
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) { //callback function goes inside .exec, "comments" comes from the array defined in campgrounds.js
        if (err) {
            console.log(err + " while finding campground by ID, problem in /campground/:id route");
        } else {
            // find the campground with the provided ID and render show template with that campground
            res.render("campgrounds/show", {valueInshowTemplate: foundCamp});
        }
    });

});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) { //if we get to this point, there shouldn't be an error
        res.render("campgrounds/edit", {valueInEditTemplate: foundCamp});
    });
});

//UPDATE CAMPGROUND ROUTE (this is where EDIT submits)
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //find and update the correct campground
    //redirect to showpage
    // You can also declare a separate object with three attribute and then put that object in the command below, but we will bundle everything in valueInEditTemplate
    Campground.findByIdAndUpdate(req.params.id, req.body.valueInEditTemplate, {new: true}, function(err, ret_updated_camp) {
        if (err) {
            console.log(err, "while updating campground in /campgrounds/:id PUT route");
            res.redirect("/campgrounds");
        } else {
            console.log(ret_updated_camp);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPPGROUNG ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err + " happened while deleting the campground");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



// If you're using EXPRESS ROUTER, this is the way to return things back to app.js
module.exports = router;