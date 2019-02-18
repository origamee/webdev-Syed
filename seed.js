var mongoose    = require("mongoose"),
    Campground  = require("./models/campgrounds"),
    Comment     = require("./models/comments")
    
//Define an array as per our model to seed the DB
var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1477581265664-b1e27c6731a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Lorem ipsum dolor sit amet, assum temporibus qui id, dolorem blandit eam cu. Corpora delicatissimi te sea. Tempor nominati scribentur cum cu. Ut quot necessitatibus nec, te veri graeco liberavisse mea. Pri ferri inani deleniti an, qui corpora temporibus et. Purto delicatissimi ius ut, novum saepe ex sed, aliquam perfecto singulis usu ex. Nec at omnis audiam intellegat."
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1505760894712-0cac55d259ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        description: "Lorem ipsum dolor sit amet, assum temporibus qui id, dolorem blandit eam cu. Corpora delicatissimi te sea. Tempor nominati scribentur cum cu. Ut quot necessitatibus nec, te veri graeco liberavisse mea. Pri ferri inani deleniti an, qui corpora temporibus et. Purto delicatissimi ius ut, novum saepe ex sed, aliquam perfecto singulis usu ex. Nec at omnis audiam intellegat."
    },
    {
        name: "Kenyan Floor",
        image: "https://images.unsplash.com/photo-1542810330-e5bd86abb23e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        description: "Lorem ipsum dolor sit amet, assum temporibus qui id, dolorem blandit eam cu. Corpora delicatissimi te sea. Tempor nominati scribentur cum cu. Ut quot necessitatibus nec, te veri graeco liberavisse mea. Pri ferri inani deleniti an, qui corpora temporibus et. Purto delicatissimi ius ut, novum saepe ex sed, aliquam perfecto singulis usu ex. Nec at omnis audiam intellegat."
    },

];
//remove all campgrounds whenever the app starts
function seedDB(){
    Campground.remove({}, function(err) {
    if (err) {
        console.log(err + " while removing campgrounds");
    }
    console.log("removed all campgrounds");
    //add a few campgrounds
    //if we don't put this function inside this ELSE block i.e. a callback for Campground.remove(), we don't know if remove will happen before create or create will happen before remove
    data.forEach(function(createCamps) {
        Campground.create(createCamps, function(err, newCreatedCamp){
            if (err) {
                console.log(err + " while adding a seed campground");
            } else {
                console.log("added a seed campground");
                //create a comment
                Comment.create(
                    {
                        text: "This place is great, I wish it had internet",
                        author: "Homer"
                }, function(err, createdComment) {
                    if (err) {
                        console.log(err + " while creating a seed comment");
                    } else {
                        //Associate the newly created comment to the newly created campground (same comments in this case)
                        newCreatedCamp.comments.push(createdComment);
                        newCreatedCamp.save();
                        console.log("Created new seed comment");
                    }
                });
            }
        });
    });
  });
}
  

module.exports = seedDB; //this will send our function out and will be stored in the "seedDB" require variable in the app.js file
