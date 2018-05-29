var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Mail = require('../models/Mail.js');
 router.post('/createAmail',function(req,res,next){
          var mail = new Mail();
          mail.msg = "aaa";
          mail.pic = "bbb";
          mail.save();
 });


module.exports = router;
