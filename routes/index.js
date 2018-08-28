const express  = require("express"),
    passport   = require("passport"),
    User       = require("../models/user"),
    middleware = require("../middleware");
let router     = express.Router();
    
// ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

// SIGN UP FORM ROUTE
router.get("/signup", function(req, res){
    res.render("signup");
});

// SIGN UP POST ROUTE
router.post("/signup", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Thanks for joining the community " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN FORM ROUTE
router.get("/login", function(req, res){
    res.render("login");
});

// LOGIN POST ROUTE
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.flash("success", "Goodbye " + req.user.username + ", hope to see you again soon.");
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;