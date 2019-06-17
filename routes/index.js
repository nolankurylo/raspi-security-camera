var express = require('express');
var router = express.Router();
var db = require('../queries').getDb()

router.get('/', function(req, res, next) {
    var x = db.collection("test").findOne({}, function (err, result) {
      if(err) console.log(err)
      console.log(result)
    })
   
  res.render('index', { title: `Index` });
});

module.exports = router;
