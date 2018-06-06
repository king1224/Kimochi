var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User.js');
var Mail = require('../models/Mail.js');
var datetime = require('node-datetime');
var returnRouter=function(io){
	router.post('/sendAmail',function(req,res,next){
		var user = {};
		var mail = {};
		User.findOne({name:'test'}).exec(function(err,doc){
		user = doc;
		Mail.findOne().exec(function(err,doc){
			mail= doc;
			sendAmail(user._id,mail._id);
			var msg = "you got a postcard!";
			io.emit('notification',msg);
		});
		});
	});
	
	function sendAmail(userID,mailID){
		var user = {};
		User.findOne({_id:userID}).exec(function(err,doc){
		user = doc;
		var time= datetime.create().format('Y-m-d H:M:S');
		user.mails.userGet.push({mail_id:mailID,isread:false,time:time});
		user.save(function(err,ress){
			if(err){ console.log(err);}
			else {console.log (ress);}
		})
		});
	}
	
	return router;
}
module.exports = returnRouter;
