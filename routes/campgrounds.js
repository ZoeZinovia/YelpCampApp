var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    middleware  = require("../middleware");

//INDEX

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err || !campgrounds){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

//NEW

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

//CREATE

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.campgroundName;
    var image = req.body.campgroundImage;
    var description = req.body.campgroundDescription;
    var price = req.body.campgroundPrice;
    var newCampground = {name: name, image: image, description: description, price: price};
    Campground.create(newCampground, function(err, campground){
        campground.creator.id = req.user._id;
        campground.creator.username = req.user.username;
        campground.save();
        if(err){
            console.log(err);
            req.flash("error", "Sorry, campground could not be created :(");
            res.redirect("back");
        } else {
            req.flash("success", "Campground created!");
            res.redirect("/campgrounds");
        }
    });
});

// SHOW

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground could not be found :(");
            res.redirect("back");
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// EDIT

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground could not be found :(");
            res.redirect("back");
        } else{
        res.render("campgrounds/edit", {campground: foundCampground});
        }
    });                
});  


//UPDATE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
       if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground could not be updated :(");
            res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           req.flash("success", "Campground updated!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DELETE CHECK

router.get("/:id/delete", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground could not be found :(");
            res.redirect("back");
        } else{
            res.render("campgrounds/delete", {campground: foundCampground});
        }
    });    
});

//DELETE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and delete campground
    Campground.findByIdAndDelete(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground could not be deleted :(");
            res.redirect("/campgrounds/" + req.params.id);
        } else{
            req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");   
        }
    });
});

module.exports = router;