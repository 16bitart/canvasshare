var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Canvas = require("../models/canvas");
var passport = require("passport");
var middleware = require("../middleware");

// =====================================
// Auth Routes
// =====================================

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  let newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, 
  email: req.body.email})
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      req.flash("error", err.message);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, ()=>{
      req.flash("success", "Welcome to CanvasShare " + user.username)
      res.redirect("/gallery");
    });
  });
});

router.get("/login", (req, res) => {
  res.render('login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/gallery",
  failureRedirect: "/login"
}), (req, res)=> {});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("error", "Successfully logged you out.");
  res.redirect("/");
});

router.get("/profile", (req, res) => {
  Canvas.find({'author.id': req.user._id}, (err, canvases) =>{
    if(err) {
      console.log(err);
    } else {
      res.render("profile", {user: req.user, canvas: canvases});
    }
  });
});

module.exports = router;
