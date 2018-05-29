$(document).ready(function() {
	breathlight(1);
	
	$("#top_bubble_resize").click(function(){
		$("#popup_mail").animate({width:"90vw",height:"110vw",top:"15vh",left:"5vw"});
		$("#popup_background").css({"width":"100vw","height":"100vh"});
		$("#popup_down").html("TAINAN, STREET");
		$("main").css({"-webkit-filter":"blur(5px)"});
	});
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js')
		.then(reg => console.log('完成 SW 設定!', reg))
		.catch(err => console.log('Error!', err));
	}
/*
	const list = document.getElementById('list');
	fetch('data.json')
	.then(res => {
		return res.json();
	})
	.then(json => {
		//list.innerHTML = json.data;
	})
*/
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
