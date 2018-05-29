const url = 'http://luffy.ee.ncku.edu.tw:10078';
var _user_name;
var _user_password;
var userId;
var socket = io.connect(url);
var mailtoggle = true;

$(document).ready(function() {
	notifyMe();
	setUser();

	socket.on('loginResult',(data)=>{
		if(!data.code){
			alert('success login');
			showmail(data.mail);
		}
		else alert(data.code);
	});
	
	socket.on('notification', function(msg){
		notice(msg);
	});
	
	$(".mail_right").click(function(){
		$("#popup_mail").animate({width:"90vw",height:"110vw",top:"15vh",left:"5vw"});
		$("#popup_background").css({"width":"100vw","height":"100vh"});
		$("#popup_down").html("TAINAN, STREET");
		$("main").css({"-webkit-filter":"blur(5px)"});
	});
	
	$(".mail_left").click(function(){
		$("#popup_mail").animate({width:"90vw",height:"110vw",top:"15vh",left:"5vw"});
		$("#popup_background").css({"width":"100vw","height":"100vh"});
		$("#popup_down").html("TAINAN, STREET");
		$("main").css({"-webkit-filter":"blur(5px)"});
	});
	
	$("#popup_back").click(function(){
		$("#popup_mail").animate({width:"0",height:"0",top:"50vh",left:"50vw"});
		$("#popup_background").css({"width":"0px","height":"0px"});
		$("#popup_down").html("");
		$("main").css({"-webkit-filter":"blur(0px)"});
		$("#popup_nextpage").animate({width:"0%"});
		$("#popup_text").html("");
	});
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js')
		.then(reg => console.log('完成 SW 設定!', reg))
		.catch(err => console.log('Error!', err));
	}
})

$(document).on("pagecreate","#pageone",function(){
	$("#popup_pic").on("swipeleft",function(){
		$("#popup_nextpage").animate({width:"100%"});
		$("#popup_text").html("HELLO:</br>WELCOME TO TAINAN :D</br>WISH YOU A GOOD DAY.");
	});
	
	$("#popup_pic").on("swiperight",function(){
		$("#popup_nextpage").animate({width:"0%"});
		$("#popup_text").html("");
	});
});

function notice(msg) {
	let _notification = new Notification(`消息通知`,{
		body:`${msg}`,
		icon:'./icon/notify.png'
	});
	setTimeout(function(){
		_notification.close(); 
	},5000);
}

function setUser(){
	_user_name=$.cookie('user_name');
	if(_user_name){
		socket.emit('login',{
			user:_user_name
		});
	}
};

function showmail(mails){
	for(i=0;i<mails.userGet.length;i++){
		if(!mails.userGet[i].isread){
			addlist(mails.userGet[i].mail_id);
		}
	}
	
	for(i=0;i<mails.userGet.length;i++){
		if(mails.userGet[i].isread){
			addlist(mails.userGet[i].mail_id);
		} 
	}
}

function addlist(text){
	if(mailtoggle){
		$("#mails").append('<div class="mail_left"><div class="location">' + text + '</div></div>');
		mailtoggle = false;
	}
	else{
		$("#mails").append('<div class="mail_right"><div class="location">' + text + '</div></div>');
		mailtoggle = true;
	}
}

function notifyMe() {
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		console.log("This browser does not support desktop notification");
	}
	
	// Let's check whether notification permissions have alredy been granted
	else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
		var notification = new Notification("Hello!");
	}
	
	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== 'denied' || Notification.permission === "default") {
		Notification.requestPermission(function (permission) {
					
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				var notification = new Notification("Thanks for your using!");
			}
		});
	}
	// At last, if the user has denied notifications, and you 
	// want to be respectful there is no need to bother them any more.
}
