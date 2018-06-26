const mongoose = require('mongoose');
const datetime = require('node-datetime');
mongoose.connect('mongodb://uidd2018_groupH:71222217@luffy.ee.ncku.edu.tw:27017/uidd2018_groupH');

const User = require('../models/Usertest.js');
const Mail = require('../models/Mailtest.js');

const newuser = 'Kimochi';
const newpassword = 'Hong';

//call once, if need.
register(newuser, newpassword);

//racecontest(100);
  

function racecontest(count){
  if(count == 0) finish();
  User.findOne({password:'Hong'}).exec(function(err, doc){
    var tmp = parseInt(doc.name);
    tmp += 1;
    doc.name = tmp.toString();
    doc.save(function(){
      racecontest(count-1);
    });
  });
}


function register(name, password){
  User.findOne({name:name}).exec(function(err, doc){
    if(doc == null){
      var user = new User();
        user.name = name;
        user.password = password;
        user.save(function(err, res){
      });
      if(err) console.log(err);
      newmail('Kimsg', 'Kipic');
    }
    else{
      console.log('User: ' + name + ' exists.');
      /*
      doc.name = 'changed';
      doc.save(function(){
        finish();
      });
      */
    }
  });
}

function newmail(msg, pic){
  var mail = new Mail();
  mail.msg = msg;
  mail.pic = pic;
  mail.save(function(err, res){
    if(err) console.log(err);
    Mail.findOne({msg:'Kimsg',pic:'Kipic'}).exec(function(err, doc){
      if(err) console.log(err);
      sendmail(newuser, doc.mail_id);
    });
  });
}

function sendmail(username, mainID){
  User.findOne({name:username}).exec(function(err, doc){
    var time = datetime.create().format('Y-m-d H:M:S');
    doc.mails.userGet.push({
      mail_id: mainID,
      isread: false,
      time: time
    });
    doc.save(function(err, res){
      if(err) console.log(err);
      finish();
    });
  });
}

function finish(){
  console.log('done');
  process.exit();
}
