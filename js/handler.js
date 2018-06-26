const url = 'https://luffy.ee.ncku.edu.tw:10078';
const socket = io.connect(url);

$(document).ready(function(){
 	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js')
		.then(reg => console.log('完成 SW 設定!', reg))
		.catch(err => console.log('Error!', err));
	}
});

socket.on('notification', function(msg){
  notice(msg);
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

