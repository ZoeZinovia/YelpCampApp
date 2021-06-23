var express         = require("express"),
    router          = express.Router({mergeParams: true});
    passport        = require("passport"),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    User            = require("../models/user");

//LANDING
    
router.get("/", function(req, res){
    res.render("landing");
});

//NEW USER

router.get("/register", function(req, res){
    res.render("register");
}); 

//CREATE USER

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        } passport.authenticate("local")(req, res, function(){
            req.flash("success", "You're signed up. Welcome " + user.username + "!!");
            return res.redirect("/campgrounds");
        });
    });
});

//LOGIN USER

router.get("/login", function(req, res){
    res.render("login");
});

// router.get("/login2", function(req, res){
//     res.render("login2");
// });

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    successFlash: "Succesfully logged in!",
    failureRedirect: "/login",
    failureFlash: "Login details incorrect. Please try again or sign up."
}), function(req, res){
});

//LOGOUT USER

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Succesfully logged out :)");
    res.redirect("/");
});

module.exports = router;