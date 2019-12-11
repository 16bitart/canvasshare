var mongoose = require('mongoose');
var User = require('../models/user');

var commentSchema = mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  createdAt: {type: Date, default: Date.now},
  text: String,
});

module.exports = mongoose.model("Comment", commentSchema);