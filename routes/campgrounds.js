const express  = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");


// INDEX ROUTE
router.get("/", function(req, res){
    Campground.find({}, function(err, dbcampgrounds){
        if(err){
            // most basic error "handling"
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: dbcampgrounds});
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name: name, image: image, price: price, description: desc, author: author};
    Campground.create(newCampground, function(err, newCampground){
        if(err){
            console.log(err);
        } else {
            req.flash("success", name + " was added.");
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
    // find campground by id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Sorry, that campground doesn't seem to exist.");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Sorry but we couldn't find that campground.");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Sorry but we couldn't find that campground.");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", req.body.campground.name + " was updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Sorry but we couldn't find that campground.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully deleted.")
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;