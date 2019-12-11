var express           = require("express");
var mongoose          = require("mongoose");
var methodOverride    = require("method-override");
var expressSanitizer  = require("express-sanitizer");
var bodyParser        = require("body-parser");
var passport          = require('passport');
var flash             = require('connect-flash');
var localStrategy     = require('passport-local');
var User              = require('./models/user');
var authRoutes        = require("./routes/auth");
var canvasRoutes      = require("./routes/gallery");
var commentRoutes     = require("./routes/discussion");
var seedDB            = require("./seed")
require('dotenv').config();
var app = express();

let connStr = process.env.CONNECTION_STRING;
const port = process.env.PORT || 3000;

mongoose.connect(connStr, {dbName: 'canvasshare', useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs"); //render ejs files by default
app.use(express.static("public")); // serve the public directory
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); // ?_method=PUT/DELETE/UPDATE in the query string
app.use(expressSanitizer()); //after body-parser
app.use(flash());
app.locals.moment = require('moment');

app.use(require("express-session")({
  secret: "This is a secret passphrase that should be in an environment variable",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing user into every route!
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// =====================================
// Routes
// =====================================

//seedDB();

app.use(authRoutes);
app.use("/gallery", canvasRoutes);
app.use("/gallery/:id/comments", commentRoutes);


// =====================================
// Server Config
// =====================================

app.listen(port, ()=> console.log("Server has started."));