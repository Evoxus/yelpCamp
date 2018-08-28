const mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comments")
    
const data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1502993100359-6e0cee23764d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e19bf1af6566cfc50a97dc28fd54af55&auto=format&fit=crop&w=881&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1502814828814-f57efb0dc974?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b85b41ac63fecc3ef432c48f0aaea1fa&auto=format&fit=crop&w=2100&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=2100&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
]

function seedDB(){
    // Remove campgrounds to start
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        // Remove any comments in the DB
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            // add a few campgrounds back
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        // Create a comment
                        Comment.create({
                            text: "This place is great, but I wish there were internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created a new comment");
                            }
                        });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;