var express = require("express");
var router = express.Router();
var db = require("../queries").getDb();
var multer = require("multer")
var upload = multer({ dest: "images/" });


router.post('/insert', upload.array('media'), function(req, res) {
  console.log(req.files)
  var x = db.collection("images").insertOne({filename: req.files[0].filename, path: req.files[0].path}, function(err, result) {
    if (err) console.log(err);
    console.log(result);
    res.status(200).send({ msg: 'There has been a success i think!' });
  });
  
});

module.exports = router;
