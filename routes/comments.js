const express  = require("express"),
    router     = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment    = require("../models/comments"),
    middleware = require("../middleware");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            req.flash("error", "Sorry, something went wrong.");
            res.redirect("/campgrounds");
        } else {
            // create the new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // connect that comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect back to the campground show page
                    req.flash("success", "Comment added successfully");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            console.log(err);
            req.flash("error", "Sorry but we couldn't find that comment.");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            console.log(err);
            req.flash("error", "Sorry but we couldn't find that comment.");
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Sorry, something seems to have gone wrong.");
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;