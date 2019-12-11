var express = require("express");
var router = express.Router({mergeParams: true}); //allows me to use the req.body from main app.js here
var Canvas = require("../models/canvas");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//New
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Canvas.findById(req.params.id, (err, canvas) => {
    if(err) {
      console.log(err);
    } else {
      res.render("comments/new", {canvas: canvas});
    }
  });
});

//Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  Canvas.findById(req.params.id, (err, canvas) => {
    if(err){
      console.log(err);
      res.redirect("/canvas");
    } else {
      //REMEMBER TO CREATE AN ARRAY OF THE INPUT NAME ATTRIBUTES TO ACCESS req.body.comment
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
          req.flash("error", "Something went wrong");
        } else {
          //use this to add username and id to the comment author properties
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //verify the comment properly stores author in node console
          console.log(comment);
          //save the comment in the canvas array of comments
          canvas.comments.push(comment);
          canvas.save();
          //redirect to the canvas with the new comment added
          req.flash("success", "Comment added!");
          res.redirect("/gallery/"+canvas._id);
        }
      });
    }
  });
});

//Edit comments
router.get("/:comment_id/edit", (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {canvas_id: req.params.id, comment: foundComment});
    }
  });
});

//Update comments
router.put("/:comment_id", (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
    if(err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment updated!");
      res.redirect("/gallery/" + req.params.id );
    }
  });
});

//Destroy comments
router.delete("/:comment_id", (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err)=> {
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect("/gallery/" + req.params.id);
    }
  });
});


module.exports = router;