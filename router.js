var express = require("express");
var router = express.Router();
var db = require("./queries").getDb();
var multer = require("multer")
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs')

// Middlewere for converting videos sent from the pi (.h264 -> .mp4)
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/videos/")
  },
  filename: function(req, file, cb){  
    var date = new Date().toISOString()  
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
  // twilio goes here
  db.collection("videos").insertOne({filename: req.file.filename, path: req.file.path, name: req.file.filename, timestamp: new Date()}, function(err, result) {
    if (err) console.log(err);
    res.status(200).send({});
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
  // Get the path name for the video to delete it from the directory
  db.collection("videos").findOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
    if (err) console.log(err);
    path = result.path
    // Delete the video file from the directory
    fs.unlink(path, function (err) {            
        if (err) console.log(err);                         
      // Delete the video file from database too
      db.collection("videos").deleteOne({"_id": new ObjectID(req.body.id)}, function (err, result) {
          if (err) console.log(err);
          res.status(200).send({});
      });
    });
  });
});

module.exports = router;
