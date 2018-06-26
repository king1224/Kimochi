//require modules
const express = require('express');
const app = express();
const port = 10078;
const path =require('path');
const bodyParser = require('body-parser');
const ssl = require('./config/ssl.js');
const https = require('https').Server(ssl.options, app);
const io = require('socket.io').listen(https);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//require schedule distribute
var distri = require('./distribute.js').dis_tri(io);

//require routers
var test = require('./routes/test.js')(io);

//require db models
var usermodel = require('./models/User.js');

//require db models
var mailmodel = require('./models/Mail.js');

//connect db
require('./config/dbconnect.js');

//set
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(bodyParser.json({limit:'50mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
https.listen(port);


global.users = {};//online people
app.use(test);//send a mail to user:"test" and notify



//home page
app.get('/', function (req,res) {
  res.sendFile('/login.html', {root: __dirname});
});

//handle event 
//login event
app.post('/login',function(req,res){
  if(req.body.user_password == "fbuser"){
    usermodel.findOne({name:req.body.user_name}).exec(function(err,doc){
      if(doc == null){
        new usermodel({
          name: req.body.user_name,
          password: req.body.user_password
        }).save(function(){
          usermodel.findOne({name:req.body.user_name}).exec(function(err,userdata){
      			res.cookie('user', userdata._id.toString(), {path:'/',maxAge:6000000});
  	    		res.cookie('user_name', userdata.name, {path:'/',maxAge:6000000});
  			    console.log("[cookie ok!]: " + userdata.name);
  			    res.send('./inbox.html');
          });
        });
      }
      else{
      	res.cookie('user', doc._id.toString(), {path:'/',maxAge:6000000});
  	    res.cookie('user_name', doc.name, {path:'/',maxAge:6000000});
  			console.log("[cookie ok!]: " + doc.name);
  			res.send('./inbox.html');
      }
    });
  }
  else{  
  	var userdata={};
  	username=req.body.user_name;
  	userpassword=req.body.user_password;
  	usermodel.findOne({name:username,password:userpassword}).exec(function(err,doc){
  		userdata=doc; 
  		if (Object.keys(userdata).length){
  			res.cookie('user', userdata._id.toString(), {path:'/',maxAge:6000000});
  			res.cookie('user_name', userdata.name, {path:'/',maxAge:6000000});
  			console.log("[cookie ok!]: " + userdata.name);
        console.log('hi');
  			res.sendFile('/inbox.html', {root: __dirname});
  		}
  		else
	  	{
		  	res.send(false);
		  }
	  });
  }
});

app.post('/register',function(req,res){
	var userdata={};
  if(req.body.email == "fbuser"){
    usermodel.findOne({name:req.body.user_name}).exec(function(err,doc){
      if(doc == null){
        new usermodel({
          name: req.body.user_name
        }).save(function(){
        });
      }
    });
  }
  else{
    /*
	username=req.body.user_name;
	userpassword=req.body.user_password;
	usermodel.findOne({name:username,password:userpassword}).exec(function(err,doc){
		userdata=doc; 
		if (Object.keys(userdata).length){
			res.cookie('user', userdata._id.toString(), {path:'/',maxAge:600000,httpOnly:false,signed:false});
			res.cookie('user_name', userdata.name, {path:'/',maxAge:600000,httpOnly:false,signed:false});
      console.log(req.cookies);
			console.log("[cookie ok!]: " + userdata.name);
			res.sendFile('newmail.html', {root: __dirname});
		}
		else
		{
			res.send(false);
		}
	});
  */
  }
});

app.post('/checkmails',function(req, res){
  userid = req.body.user_id;
  usermodel.findOne({_id:userid}).exec(function(err, doc){
    if(doc == null){
      console.log("no user: " + userid);
      return ;
    }
    if(doc.mails.unrecv.length > 0){
      res.send({
        redirect: true,
        mails: './newmail.html'
      });
    }
    else{
      check = [];
      for(i=0;i<doc.mails.userGet.length;++i){
        check.push(false);
      }
      getinboxmail(check, doc, [], [], res);
    }
  });
});

// get all outbox mails
app.post('/outboxmails',function(req, res){
  userid = req.body.user_id;
  usermodel.findOne({_id:userid}).exec(function(err, doc){
    if(doc == null){
      console.log("no user: " + userid);
      return ;
    }
    if(doc.mails.unrecv.length > 0 && false){
      res.send({
        redirect: true,
        mails: './newmail.html'
      });
    }
    else{
      check = [];
      for(i=0;i<doc.mails.userPost.length;++i){
        check.push(false);
      }
      getoutboxmail(check, doc, [], [], res);
    }
  });
});


//getunrecv
app.post('/getunrecv', function (req,res){
   var userdata={};
   userid=req.body.user_id;
   usermodel.findOne({_id:userid}).exec(function(err,doc){
     let unrecvmails = doc.mails.unrecv; 
     let userget = doc.mails.userGet;
     res.send(unrecvmails);
     doc.mails.userGet = userget.concat(unrecvmails);
     doc.mails.unrecv = [];
     doc.save(function(err,ress){
       if(err){console.log(err);}
     });
   });
});

//get one mail by id
app.post('/getmail', function(req, res){
  mailmodel.findOne({_id:req.body.mail_id}).exec(function(err,doc){
    if(err){console.log(err);}
    if(doc == null) return;
    res.send(doc);
    usermodel.findOne({_id:req.body.user_id}).exec(function(err, doc){
      if(err){console.log(err);}
      if(doc == null) return;
      for(i=0;i<doc.mails.userGet.length;++i){
        if(doc.mails.userGet[i].mail_id == req.body.mail_id){
          doc.mails.userGet[i].isread = true;
          doc.save(function(){
            return;
          });
        }
      }
    });
  });
});

//toggle like
app.post('/togglelike', function(req, res){
  usermodel.findOne({_id:req.body.user_id}).exec(function(err, doc){
    if(err){console.log(err);}
    if(doc == null) return;
    for(i=0;i<doc.mails.userGet.length;++i){
      if(doc.mails.userGet[i].mail_id == req.body.mail_id){
        doc.mails.userGet[i].islike = !doc.mails.userGet[i].islike;
        res.send(doc.mails.userGet[i].islike);
        doc.save(function(){
          return;
        });
      }
    }
  });
});

//toggle 
app.post('/togglecollect', function(req, res){
  usermodel.findOne({_id:req.body.user_id}).exec(function(err, doc){
    if(err){console.log(err);}
    if(doc == null) return;
    for(i=0;i<doc.mails.userGet.length;++i){
      if(doc.mails.userGet[i].mail_id == req.body.mail_id){
        doc.mails.userGet[i].iscollect = !doc.mails.userGet[i].iscollect;
        res.send(doc.mails.userGet[i].iscollect);
        doc.save(function(){
          return;
        });
      }
    }
  });
});

//io event
io.on('connection',function(socket){
  sockets = socket;
	//login event
	socket.on('newclient',(data)=>{
		socket.name = data.user;
		if (!users[data.user]) {
			users[data.user] = socket.id;
		}
	});

  socket.on('w',(data)=>{
    a=1;
  });

	//disconnect event
	socket.once('disconnect',function(){
		for(var x in users){
			if( users[x] == socket.id ) {
				delete users[x];
			}
		}
		console.log(users);
	});
});

//module.exports = app;

//MongoDB
//URL, may change due to different server
const db_url = 'mongodb://uidd2018_groupH:71222217@luffy.ee.ncku.edu.tw/uidd2018_groupH';
const db_name = 'uidd2018_groupH';
const db_col = 'Mail';
//import mongodb
var MongoClient = require('mongodb').MongoClient;
//Test DB connection
app.post("/KMail", function (req, res) {
	MongoClient.connect(db_url, function (err, client) {
		const db = client.db(db_name);
		const col = db.collection(db_col);

		if (err) console.log(err);
		col.insertOne({
			msg: req.body.text,
			pic: req.body.picture
		});
		client.close();
	});
	res.send("send success");
});






function getinboxmail(check, user, mails, userget, res){
	for(i=0;i<user.mails.userGet.length;i++){
  	if(!user.mails.userGet[i].isread && !check[i]){
  		mailmodel.findOne({_id:user.mails.userGet[i].mail_id}).exec(function(err,doc){
 			  check[i] = true;
        mails.push(doc);
        userget.push(user.mails.userGet[i]);
        getinboxmail(check, user, mails, userget, res);
 		  });
      return;
	  }
	}
				
  for(i=0;i<user.mails.userGet.length;i++){
  	if(user.mails.userGet[i].isread && !check[i]){
  		mailmodel.findOne({_id:user.mails.userGet[i].mail_id}).exec(function(err,doc){
        check[i] = true;
        mails.push(doc);
        userget.push(user.mails.userGet[i]);
        getinboxmail(check, user, mails, userget, res);
  		});
      return;
  	} 
  }
  res.send({
    redirect: false,
    mails: mails,
    userget: userget
  });
}


function getoutboxmail(check, user, mails, userpost, res){
	for(i=0;i<user.mails.userPost.length;i++){
  	if(!check[i]){
  		mailmodel.findOne({_id:user.mails.userPost[i].mail_id}).exec(function(err,doc){
 			  check[i] = true;
        mails.push(doc);
        userpost.push(user.mails.userPost[i]);
        getoutboxmail(check, user, mails, userpost, res);
 		  });
      return;
	  }
	}
  console.log("hi");
  res.send({
    redirect: false,
    mails: mails,
    userpost: userpost
  });
}
