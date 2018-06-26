//const url = 'https://luffy.ee.ncku.edu.tw:10078';
var _user_name;
var _user_password;
var userId;
//var socket = io.connect(url);
var mailtoggle = true;
var outboxmails;
var mailcount;

$(document).ready(function() {
	notifyMe();
	setUser();

  $.ajax({
    type:"POST",
    url:"/outboxmails",
    data:
    {
      user_id: $.cookie('user')
    },
    success:function(data){
      if(data.redirect){
        window.location = data.mails;
      }
      else{
				outboxmails = data.userpost;
				mailcount = 0;
			  showmail(data.mails);
        console.log(data);
				for(i=0;i<outboxmails.length;++i){
					$("#mail" + i).click(function(){
						mailcount = $(this).attr('id')[4];
						$("#popup_mail").animate({width:"90vw",height:"110vw",top:"15vh",left:"5vw"});
						$("#popup_background").css({"width":"100vw","height":"100vh"});
						$("#popup_down").html("TAINAN, STREET");
						$("main").css({"-webkit-filter":"blur(5px)"});
						$("#popup_text").hide();

						$.ajax({
							type:"POST",
							url:"/getmail",
							data:
							{
								mail_id: outboxmails[mailcount].mail_id,
								user_id: $.cookie('user')
							},
							success:function(data){
								$("#popup_pic img").attr("src", data.pic);
								$("#popup_text").html(data.msg);
							},
							error:function(){
								console.log("Get outboxmail Error!");
							}
						});
					});
				}
      }
    },
    error:function(){
      console.log("CheckRecv Error!");
    }
  });
	
	$("#popup_back").click(function(){
		$("#popup_mail").animate({width:"0",height:"0",top:"50vh",left:"50vw"});
		$("#popup_background").css({"width":"0px","height":"0px"});
		$("#popup_down").html("");
		$("main").css({"-webkit-filter":"blur(0px)"});
		$("#popup_nextpage").animate({width:"0%"});
		$("#popup_text").html("");
	});
	
	$("#type1").click(function(){
		$(".mail_left2").removeClass("mail_left2").addClass("mail_left");
		$(".mail_right2").removeClass("mail_right2").addClass("mail_right");
	});
	
	$("#type2").click(function(){
		$(".mail_left").removeClass("mail_left").addClass("mail_left2");
		$(".mail_right").removeClass("mail_right").addClass("mail_right2");
	});
	/*
	$("#popup_like").click(function(){
    //change the heart color
    $.ajax({
      type:"POST",
      url:"/togglelike",
      data:
      {
        mail_id: inboxmails[mailcount].mail_id,
        user_id: $.cookie('user')
      },
      success:function(data){
        if(data){
          $("#popup_like").css("background-image", "url('../images/kekeke-18-2.png')");
        }
        else{
          $("#popup_like").css("background-image", "url('../images/kekeke-18.png')");
        }
      },
      error:function(){
        console.log("Get like Error!");
      }
    });
	});
 
	$("#popup_collection").click(function(){
    //change the collection color
    $.ajax({
      type:"POST",
      url:"/togglecollect",
      data:
      {
        mail_id: inboxmails[mailcount].mail_id,
        user_id: $.cookie('user')
      },
      success:function(data){
        if(data){
          $("#popup_collection").css("background-image", "url('../images/kekeke-19-2.png')");
        }
        else{
          $("#popup_collection").css("background-image", "url('../images/kekeke-19.png')");
        }
      },
      error:function(){
        console.log("Toggle collect Error!");
      }
    });
	});
	*/

	$("#popup_menu").click(function(){
    $("#popup_all").css({
      "width": "90vw",
      "z-index": "103"
    });
    $("#menu_list").css("width", "81vw");
    $("#save").html("Save to gallery");
    $("#feedback").html("Give feedback on this post");
    $("#remove").html("Remove");
  });

  $("#popup_all").click(function(){
    $("#popup_all").css({
      "width": "0vw",
      "z-index": "0"
    });
    $("#menu_list").css("width", "0vw");
    $("#save").html("");
    $("#feedback").html("");
    $("#remove").html("");
  });

  $("#remove").click(function(){
    console.log("I won't remove mails for now... It's not easy to resend!!!");
  });
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

function setUser(){
	_user_name=$.cookie('user_name');
	if(_user_name){
		socket.emit('newclient',{
			user:_user_name
		});
	}
};

function showmail(mails){
  for(i=0;i<mails.length;++i){
	  addlist(mails[i].msg, mails[i].pic);
  }
	$("#mails").append('<div style="float:left;height:7vh;width:100vw"></div>');
}

function addlist(text, pic){
	if(mailtoggle){
		$("#mails").append('<div id="mail' + mailcount + '" class="mail_left"><img src="' + pic + '"/><div class="location">' + text + '</div></div>');
		mailtoggle = false;
	}
	else{
		$("#mails").append('<div id="mail' + mailcount + '" class="mail_right"><img src="' + pic + '"/><div class="location">' + text + '</div></div>');
		mailtoggle = true;
	}
	++mailcount;
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
