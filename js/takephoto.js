'use strict';

var Isshot = false;
var video = document.querySelector('video');
var canvas1=window.canvas=document.querySelector('#canvas1');
var xoffset=0;
var yoffset=0;

$(document).ready(function() {
	checkmedia();

  $('.btnShare').click(function(){
    var elem = $(this);
    var url = "https://luffy.ee.ncku.edu.tw/~king1224/Kimochi/login.html";
    var pic = "https://luffy.ee.ncku.edu.tw/~king1224/Kimochi/images/kekeke-05.png";
    FB.ui({
      method: 'feed',
      link: url,
      picture: pic,
      name: elem.data('title'),
      description: elem.data('desc')
    },function(){});
    return false;
  });


  //avoid page deform
  //==========================================================
  //get the original page height size
  var original = document.documentElement.clientHeight;
  //add event that resize the page
  window.addEventListener("resize", function() {
    var resizeHeight = document.documentElement.clientHeight;
    $('body').height(original);
    $('#taking').height(original);
    $('#writing').height(original);
    $('#text_title').height(original*0.03);
    $('#text_title').css('top',(original*0.03)+'px');
  });
  //==========================================================

  //load localStorage text
  //==========================================================
  $('#inputtext').val(window.localStorage.getItem("inputtext"));
  //==========================================================
  
  //store text
  //==========================================================
  $('#inputtext').on('input',function(e){
		var texttext = $("#inputtext").val();
		window.localStorage.setItem("inputtext",texttext);
  });
  //==========================================================
	
	$("#photo_back").click(function(){
		if(Isshot){
			canvas1.style.display="none";
			video.style.display="block";
			$("#photo_ok").fadeOut();
			$("#text_title").fadeOut();
			Isshot = false;
		}
		else{
			window.location = './inbox.html';
		}
	});
	
	$("#shot").click(function(){
		canvas1.getContext('2d').
			drawImage(video,xoffset,yoffset,video.videoWidth-2*xoffset,video.videoHeight-2*yoffset,0,0,canvas1.width,canvas1.height);
		console.log(xoffset);
		console.log(yoffset);
		video.style.display="none";
		canvas1.style.display="block";
		Isshot = true;
		$("#photo_ok").fadeIn();
		$("#text_title").fadeIn();
	});
	
	$("#photo_ok").click(function(){
		$("#taking").css({"z-index":"1"});
		$("#writing").css({"z-index":"2"});
		canvas2.getContext('2d').
			drawImage(canvas1,0,0,canvas1.width,canvas1.height,0,0,canvas2.width,canvas2.height);
	});
	
	$("#text_back").click(function(){
		$("#taking").css({"z-index":"2"});
		$("#writing").css({"z-index":"1"});
	});
	
	$("#text_send").click(function(){
    //clear localStorage text
    //==========================================================
    window.localStorage.removeItem("inputtext");
    //==========================================================

		//send data to mongodb
		$.ajax({
			type:"POST",
			url:"/KMail",
			data:
			{
				picture:canvas2.toDataURL(),
				text:inputtext.value
			},
			success:function(data){
				console.log(data);
				setTimeout(function(){window.location = './newmail.html';},5000);
				alert('send OK!');
			},
			error:function(){
				console.log("send error");
			}
		});
	});
	
	var constraints = {
		audio: false,
		video: true
	};
	
	function handleSuccess(stream) {
		window.stream = stream; // make stream available to browser console
		video.srcObject = stream;
	}

	function handleError(error) {
		console.log('navigator.getUserMedia error: ', error);
	}

	navigator.mediaDevices.getUserMedia(constraints).
		then(handleSuccess).catch(handleError);
/*	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js')
		.then(reg => console.log('完成 SW 設定!', reg))
		.catch(err => console.log('Error!', err));
	}
*/
})

function checkmedia(){
	if(video.videoWidth == 0 || video.videoHeight == 0){
		//console.log("Camera not READY!!!");
		setTimeout("checkmedia();",100);
	}
	else{
		var ratio1 = video.videoWidth / video.videoHeight;
		var ratio2 = $("#video_space").width() / $("#video_space").height();
		if(ratio1 > ratio2){
			$('#video').css({"height":"60vh"});
			xoffset = ($('#video').width() - $('#video_space').width()) / 2;
			$('#video').css({"transform":"translateX(-" + xoffset +"px)"});
			xoffset = xoffset * video.videoWidth / $('#video').width();
		}
		else{
			$('#video').css({"width":"100vw"});
			yoffset = ($('#video').height() - $('#video_space').height()) / 2;
			$('#video').css({"transform":"translateY(-" + yoffset +"px)"});
			yoffset = yoffset * video.videoHeight / $('#video').height();
		}
	}
}



window.fbAsyncInit = function() {
	FB.init({
		appId      : '207149940007425',
		cookie     : true,  // enable cookies to allow the server to access 
												// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.8' // use graph api version 2.8
	});
};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


