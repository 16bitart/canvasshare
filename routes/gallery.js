var express = require("express");
var router = express.Router();
var Canvas = require("../models/canvas");
var middleware = require("../middleware");

//Index Route

router.get("/", (req, res) => {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Canvas.find({name: regex}, (err, foundCanvases) => {
      if(err){
        req.flash("error", err.message);
        console.log(err);
      } else {
        res.render("gallery/index", {canvas: foundCanvases});
      }
    });
  } else {
    Canvas.find({}, (err, canvases) => {
      if(err){
        console.log(err);
      } else {
        res.render("gallery/index", {canvas: canvases});
      }
    });
  }
});


//Create Route

router.post("/", (req, res) => {
  let author = {id: req.user._id, username: req.user.username};
  let newCanvas = {name: req.body.name, image: req.body.image, description: req.body.description, author: author };
  
  Canvas.create(newCanvas, (err, newCanvas) => {
    if(err){
      console.log(err);
    } else {
      console.log(newCanvas);
      res.redirect("/gallery");
    }
  });
});

//New Route


router.get("/new", (req, res) => {
  res.render("gallery/new");
});

//Show Route

router.get("/:id", (req, res) => {
  Canvas.findById(req.params.id).populate("comments").exec(function(err, foundCanvas){
    if(err){
      console.log(err);
    } else {
      res.render("gallery/show", {canvas: foundCanvas});
    }
  });
});

// Edit Route

router.get("/:id/edit", middleware.checkCanvasOwner, (req, res) => {
  Canvas.findById(req.params.id, (err, foundCanvas) =>{
    res.render("gallery/edit", {canvas: foundCanvas});
  });
});

//Update Route

router.put("/:id", middleware.checkCanvasOwner, (req, res) => {
  let canvas = req.body.canvas;
  //find and update the correct canvas
  Canvas.findByIdAndUpdate(req.params.id, canvas, (err, updatedCanvas) => {
    if(err){
      res.redirect("/gallery");
    } else {
      res.redirect("/gallery/" + updatedCanvas._id);
    }
  });
  //redirect to show page
});

//Destroy Route

router.delete("/:id", middleware.checkCanvasOwner, (req, res) => {
  Canvas.findByIdAndDelete(req.params.id, (err) => {
    if(err){
      console.log(err);
      res.redirect("/gallery");
    }
  });
});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;