const express      = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    // moved the routes that made use of these models into their own files
    // Campground     = require("./models/campground"),
    // Comment        = require("./models/comments"),
    User           = require("./models/user"),
    seedDB         = require("./seeds"),
    app            = express();

const commentRoutes  = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// Database seed function outdated now that users have been implemented
// seedDB();

// DATABASE CONNECTION
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

// APP MODULES
app.use(bodyParser.urlencoded({extended: true}));
// __dirname uses current directory as a failsafe
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Orcs are beautiful people too. They don't only have to marry goblins!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PASS VARIABLES TO ALL PAGES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ROUTE SETTINGS
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Initializing YelpCamp Server... Successful");
});