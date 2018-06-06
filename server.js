//require modules
var express = require('express');
var app = express();
const port = 10078;
var path =require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

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
app.use(bodyParser());
http.listen(port);


global.users = {};//online people
app.use(test);//send a mail to user:"test" and notify



//home page
app.get('/', function (req,res) {
	console.log('uesr: ' + req.cookies.user);
	if (req.cookies.user == null) {
		res.redirect('/login');
	} 
	else {
		res.sendFile('newmail.html', {root: __dirname});
	}
});

//login page
app.get('/login',function(req,res){
	res.sendFile('login.html', {root: __dirname});
});

//handle event
//login event
app.post('/login',function(req,res){
	var userdata={};
	username=req.body.user_name;
	userpassword=req.body.user_password;
	usermodel.findOne({name:username,password:userpassword}).exec(function(err,doc){
		userdata=doc; 
		if (Object.keys(userdata).length){
			res.cookie('user',userdata._id,{path:'/',maxAge:600000});
			res.cookie('user_name',userdata.name,{path:'/',maxAge:600000});
			console.log("[cookie ok!]: " + userdata.name);
			res.redirect('/');
		}
		else
		{
			res.send(false);
		}
	});
});

//io event
io.on('connection',function(socket){
	//login event
	socket.on('login',(data)=>{
		socket.name = data.user;
		if (!users[data.user]) {
			users[data.user] = socket.id;
			usermodel.findOne({name:data.user}).exec(function(err,doc){
				results = []
				for(i=0;i<doc.mails.userGet.length;i++){
					if(!doc.mails.userGet[i].isread){
						mailmodel.findOne({_id:doc.mails.userGet[i].mail_id}).exec(function(err,doc){
							results.push(doc);
							socket.emit('loginResult',{
								mail:doc
							});
						});
					}
				}
				
				for(i=0;i<doc.mails.userGet.length;i++){
					if(doc.mails.userGet[i].isread){
						mailmodel.findOne({_id:doc.mails.userGet[i].mail_id}).exec(function(err,doc){
							results.push(doc);
							socket.emit('loginResult',{
								mail:doc
							});
						});
					} 
				}
			});
		}
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
