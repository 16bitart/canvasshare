var Canvas = require("../models/canvas");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCommentOwner = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err){
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash("error", "Please login first.");
    res.redirect("/login");
  }
}

middlewareObj.checkCanvasOwner = function(req, res, next){
  if(req.isAuthenticated()){
    Canvas.findById(req.params.id, (err, foundCanvas) => {
      if(err){
        req.flash("error", "Canvas not found.");
        res.redirect("back");
      } else {
        if(foundCanvas.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("back");
  }
}

module.exports = middlewareObj;