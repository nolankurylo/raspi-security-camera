var express = require("express");
var router = express.Router();
var db = require("../queries").getDb();
/* GET users listing. */
router.post('/insert', function(req, res) {
  console.log(req.body)
  res.status(200).send({msg:'There has been a success i think!'});
});

module.exports = router;
