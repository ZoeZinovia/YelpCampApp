var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    middleware  = require("../middleware");

//NEW COMMENT

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Sorry, comment could not be submitted:(");

        } else{
            res.render("comments/new", {campground: foundCampground});
        }
    });    
});

//CREATE COMMENT

router.post("/", middleware.isLoggedIn, function(req, res){
    // var text= req.body.text;
    // var author = req.body.author;
    var newComment = req.body.comment;
    Comment.create(newComment, function(err, comment){
        Campground.findById(req.params.id, function(err, campground){
            if(err || !campground){
                console.log(err);
            req.flash("error", "Sorry, comment could not be submitted:(");
            } else{
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save(function(err, data){
                    if(err){
                        console.log(err);
                        req.flash("error", "Sorry, comment could not be submitted :(");
                    } else{
                        req.flash("success", "Comment submitted!");
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });
            }
        });
    });
});

//EDIT

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                res.redirect("back");
            } else{
                res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
            }
    });              
});  



//UPDATE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find and update the correct campground
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
       if(err || !foundComment){
            console.log(err);
            req.flash("error", "Sorry, comment could not be updated :(");
            res.redirect("back");
       } else {
           //redirect somewhere(show page)
           req.flash("success", "Comment updated!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DELETE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find and delete campground
    Comment.findByIdAndDelete(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            console.log(err);
            req.flash("error", "Sorry, comment could not be deleted :(");
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" +  req.params.id);   
        }
    });
});

module.exports = router;