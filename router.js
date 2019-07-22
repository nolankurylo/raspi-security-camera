var express = require("express");
var router = express.Router();
var db = require("./queries").getDb();
var multer = require("multer")
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs')

// Twilio configuration
const accountSid = "AC99e2af84dce6a9e8c8b7f7d39e0cdca4";
const authToken = "7c8a058357f7638f7dee531f08dcc98a";
const client = require("twilio")(accountSid, authToken);

// Middlewere to convert videos sent from the pi (.h264 -> .mp4)
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/videos/")
  },
  filename: function(req, file, cb){  
    var date = new Date().toISOString()
    // Create a filename that can be parsed by Pug
    date = date.replace(/\/|:|\./g, "-");
    cb(null, date + file.originalname )
  }
})

var upload = multer({storage:storage});

// Index page (render)
router.get('/', function (req, res, next) {
  db.collection("videos").find().toArray(function (err, result) {
    if (err) console.log(err)
    return res.render("index", {videos: result});
  })
});

// Endpoint for raspi to send video to 
router.post('/insert', upload.single('media'), function(req, res) {
  // Send SMS Twilio message to my phone
  client.messages
    .create({
      body: `The Raspberry Pi Security Camera detected movement just now at: ${new Date().toLocaleString()}`,
      from: '+12049008834',
      to: '+14038092980'
    })
    .then(function (message) {    
      db.collection("videos").insertOne({filename: req.file.filename, path: req.file.path, name: req.file.filename, timestamp: new Date()}, function(err, result) {
        if (err) console.log(err);
        res.status(200).send({});
      });
  })
  .catch(function(err) {
     console.log(err)
     res.status(500).send(err);
  });
});

// Endpoint to update name of a video
router.patch('/edit_name', function (req, res) {
    db.collection("videos").updateOne({"_id": new ObjectID(req.body.id)},{ $set: {"name": req.body.name}}, {upsert: false}, function (err, result) {
        if (err) console.log(err);
        res.status(200).send({});
    });

});

// Endpoint to delete a video
router.post('/delete_video', function (req, res) {
  // Get the path name for the video to delete it from local directory
  db.collection("videos").findOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
    if (err) console.log(err);
    path = result.path
    // Delete the video file from local directory
    fs.unlink(path, function (err) {            
        if (err) console.log(err);                         
      // Delete the video file from database 
      db.collection("videos").deleteOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
          if (err) console.log(err);
          res.status(200).send({});
      });
    });
  });
});

module.exports = router;
