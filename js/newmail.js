var unrecvmails;
var mailcount;
$(document).ready(function() {
	
  $.ajax({
    method:"post",
    url:"./getunrecv",
    data:{
    	user_id : $.cookie('user')
    },
    success:function(data){
      unrecvmails = data;
      mailcount = 0;
    	console.log(data);
  	}
	});

	breathlight(1);
	
	$("#top_bubble_resize").click(function(){
		$("#popup_mail").animate({width:"90vw",height:"110vw",top:"15vh",left:"5vw"});
		$("#popup_background").css({"width":"100vw","height":"100vh"});
		$("main").css({"-webkit-filter":"blur(5px)"});
		$("#popup_down").html("TAINAN, STREET");
		$("#next_mail").html("NEXT");
		$("#popup_text").hide();

    if(unrecvmails[mailcount].islike){
      $("#popup_like").css("background-image", "url('../images/kekeke-18-2.png')");
    }
    else{
      $("#popup_like").css("background-image", "url('../images/kekeke-18.png')");
    }

    if(unrecvmails[mailcount].iscollect){
      $("#popup_collection").css("background-image", "url('../images/kekeke-19-2.png')");
    }
    else{
      $("#popup_collection").css("background-image", "url('../images/kekeke-19.png')");
    }

    $.ajax({
      type:"POST",
      url:"/getmail",
      data:
      {
        mail_id: unrecvmails[mailcount].mail_id,
        user_id: $.cookie('user')
      },
      success:function(data){
		    $("#popup_pic img").attr("src", data.pic);
		    $("#popup_text").html(data.msg);
      },
      error:function(){
        console.log("Get unrecvmail Error!");
      }
    });
	});
  
	$("#next_mail").click(function(){
    ++mailcount;
    if(mailcount > unrecvmails.length) return;
		$("#popup_down").html("TAINAN, STREET");
		$("#popup_nextpage").animate({width:"0%"});
		$("#popup_text").hide();

    if(unrecvmails[mailcount].islike){
      $("#popup_like").css("background-image", "url('../images/kekeke-18-2.png')");
    }
    else{
      $("#popup_like").css("background-image", "url('../images/kekeke-18.png')");
    }

    if(unrecvmails[mailcount].iscollect){
      $("#popup_collection").css("background-image", "url('../images/kekeke-19-2.png')");
    }
    else{
      $("#popup_collection").css("background-image", "url('../images/kekeke-19.png')");
    }

    $.ajax({
      type:"POST",
      url:"/getmail",
      data:
      {
        mail_id: unrecvmails[mailcount].mail_id,
        user_id: $.cookie('user')
      },
      success:function(data){
		    $("#popup_pic img").attr("src", data.pic);
		    $("#popup_text").html(data.msg);
      },
      error:function(){
        console.log("Get unrecvmail Error!");
      }
    });
	});
 
	$("#popup_like").click(function(){
    //change the heart color
    $.ajax({
      type:"POST",
      url:"/togglelike",
      data:
      {
        mail_id: unrecvmails[mailcount].mail_id,
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
        mail_id: unrecvmails[mailcount].mail_id,
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
		setTimeout(function(){$("#popup_text").show();}, 500);
	});
	
	$("#popup_pic").on("swiperight",function(){
		$("#popup_nextpage").animate({width:"0%"});
		$("#popup_text").hide();
	});
});

function breathlight(flag){
	if(flag === 1){
		$("#top_bubble_resize").animate({width:"70%",height:"70%",left:"15%"},1000);
		setTimeout(function(){ breathlight(2); }, 1000);
	}
	else if(flag === 2){
		$("#top_bubble_resize").animate({width:"100%",height:"100%",left:"0%"},1000);
		setTimeout(function(){ breathlight(1); }, 1000);
	}
}
