
var express                     = require("express"),
    app                         = express(),
    bodyParser                  = require("body-parser"),
    mongoose                    = require("mongoose"),
    methodOverride              = require("method-override"),
    Campground                  = require("./models/campground"),
    Comment                     = require("./models/comment"),
    User                        = require("./models/user"),
    seedDB                      = require("./seeds"),
    passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose"),
    expressSession              = require("express-session"),
    flash                       =require("connect-flash");

var commentRoutes               = require("./routes/comments"),
    campgroundRoutes            = require("./routes/campgrounds"),
    indexRoutes                 = require("./routes/index");

//----Set up----#

var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//-----Authentication----//
app.use(expressSession({
    secret: "I love cheese more than anything", 
    cookie: {_expires: (20*60*1000)} ,
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-----Routes----//

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

// seedDB();

app.listen(process.env.PORT || 3000, function(){
   console.log("Hello, I'm the server and I'm up.")
});