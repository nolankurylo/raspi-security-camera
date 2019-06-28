var express = require("express");
var router = express.Router();
var db = require("../queries").getDb();
var multer = require("multer")

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

router.post('/insert', upload.single('media'), function(req, res) {
  console.log(req.file)
  console.log("insert")
  var x = db.collection("videos").insertOne({filename: req.file.filename, path: req.file.path}, function(err, result) {
    if (err) console.log(err);
    res.status(200).send({ msg: 'There has been a success i think!' });
  });
  
});

module.exports = router;
