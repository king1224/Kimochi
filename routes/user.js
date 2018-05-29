var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User.js');
      router.post('/register',function(req,res,next){
             var user = new User();
             var username = req.body.user_name;
             var userpassword = req.body.user_password;
               user.name=username;
               user.password=userpassword;
             user.save(function(err,ress){
                   if(err){ console.log(err);}
                   else {console.log (ress); res.send(ress);}
                                        })
                                                });
module.exports = router;
