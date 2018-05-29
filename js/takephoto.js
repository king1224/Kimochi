'use strict';

var Isshot = false;
var video = document.querySelector('video');
var canvas1=window.canvas=document.querySelector('#canvas1');
var xoffset=0;
var yoffset=0;

$(document).ready(function() {
	checkmedia();
	
	$("#photo_back").click(function(){
		if(Isshot){
			canvas1.style.display="none";
			video.style.display="block";
			$("#photo_ok").fadeOut();
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
			},
			error:function(){
				console.log("send error");
			}
		});
		window.location = './inbox.html';
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
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js')
		.then(reg => console.log('完成 SW 設定!', reg))
		.catch(err => console.log('Error!', err));
	}
})

function checkmedia(){
	if(video.videoWidth == 0 || video.videoHeight == 0){
		console.log("Camera not READY!!!");
		setTimeout("checkmedia();",100);
	}
	else{
		var ratio1 = video.videoWidth / video.videoHeight;
		var ratio2 = $("#canvas1").width() / $("#canvas1").height();
		if(ratio1 > ratio2){
			$('#video').css({"height":"60vh"});
			xoffset = ($('#video').width() - $('#canvas1').width()) / 2;
			$('#video').css({"transform":"translateX(-" + xoffset +"px)"});
			xoffset = xoffset * video.videoWidth / $('#video').width();
		}
		else{
			$('#video').css({"width":"100vw"});
			yoffset = ($('#video').height() - $('#canvas1').height()) / 2;
			$('#video').css({"transform":"translateY(-" + yoffset +"px)"});
			yoffset = yoffset * video.videoHeight / $('#video').height();
		}
	}
}
