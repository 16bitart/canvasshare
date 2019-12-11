var Canvas = require('./models/canvas');
var Comment = require('./models/comment');
var User = require('./models/user');

var data = [
  {
    name: "Starry Night",
    image: "https://www.vangoghgallery.com/img/starry_night_full.jpg",
    description: "Van Gogh's Starry Night",
    author: {
      username: "Van Gogh"
    }
  },
  {
    name: "The Scream",
    image: "https://www.edvardmunch.org/images/paintings/the-scream.jpg",
    description: "Munch's Scream",
    author: {
      username: "Munch"
    }
  }
];

function seedDB(){
  Canvas.remove({},(err) =>{
    if(err) {
      console.log(err);
    } else {
      console.log("Seed initiated. Remove success")
      data.forEach(function (seed) {
        Canvas.create(seed, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            //add comment now
            Comment.create(
              {
                text: "Testing comment.",
                author: {username: "cwille"}
              }, function(err, comment) {
                if(err){
                  console.log(err)
                } else {
                  data.comments.push(comment);
                  data.save();
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;