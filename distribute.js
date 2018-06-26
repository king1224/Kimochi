var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var Mail = require('./models/Mail.js');
var datetime = require('node-datetime');
var shuffle = require('shuffle-array');
var schedule = require('node-schedule');
var block_num = [];

for(var i=0;i<24;i++){
	var k = {$gte: i/24, $lt: (i+1)/24};
	block_num.push(k);
}

var distribute = {
     dis_tri: function(io){
        var i=-1;

        //schedule,'sec min hour mon year day_of_week'
        schedule.scheduleJob('10 34 * * * *', function(){
          //when all of the ranges used,shuffle the range
          if(++i > 23) {
            i=0;
            shuffle(block_num);
          }
          console.log(i);
          console.log(block_num[i]);
          distribution(block_num[i],io);
        });
     },
}

//use to get users and mails
function distribution(range,io){
     User.find({random_ID:range}).exec(function(err,userdoc){
          userdoc.forEach((user)=>{
            let post = user.mails.userPost;
            let get = user.mails.userGet;
             Mail.aggregate().sample(100).exec(function(err,mails){
                for(var i=0;i<100;i++){
                  //detect the mail is exist in user or not
                  if(Object.values(get).indexOf(mails[i]._id) === -1 && Object.values(post).indexOf(mails[i]._id) === -1){
                    sendAmail(user._id,mails[i]._id,io);
                    break;
                  }
                }
             });
          });
     });

};

//send the mail to user and send message to socket
//if user is offline,record the mail to DB
function sendAmail(userID,mailID,io){
    var user = {};
    User.findOne({_id:userID}).exec(function(err,doc){
         user = doc;
         var time= datetime.create().format('Y-m-d H:M:S');
         user.mails.unrecv.push({mail_id:mailID,isread:false,time:time});
         user.save(function(err,ress){
           if(err){ console.log(err);}
           else {
             Mail.findOne({_id:mailID}).exec(function(mailerr,maildoc){
               if(user._id in users){
                 var msg = "you got a postcard!";
                 //send got mail message
                 io.sockets.connected[users[user._id]].emit('notification',msg);
               }
             });
           }
         });
    });
}
module.exports = distribute;


