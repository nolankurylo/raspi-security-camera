var express = require('express');
var router = express.Router();
var db = require('../queries').getDb()

router.get('/', function(req, res, next) {
    var x = db.collection("images").findOne({}, function (err, result) {
      if(err) console.log(err)
      console.log(result)
    })
   
  res.render('index', { title: `Home` });
});

router.get('/library', function (req, res, next) {
  var x = db.collection("images").find().toArray( function (err, result) {
    if (err) console.log(err)
    console.log(result)
    return res.render("library", { title: `Library`, images: result });
  })

});

module.exports = router;
