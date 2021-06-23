var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// general middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
}

//campground middleware

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundCampground.creator.id.equals(req.user._id)){
                    next();                
                } else{
                    req.flash("error", "Sorry, you're not authorized to do that!");
                    res.redirect("back");
                }
            }
        });  
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    } 
}

//comment middleware

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();                
                } else{
                    req.flash("error", "Sorry, you're not authorized to do that!");
                    res.redirect("back");
                }
            }
        });  
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

module.exports = middlewareObj;