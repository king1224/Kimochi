$(document).ready(function() {

  //avoid page deform
  //==========================================================
  //get the original page height size
  var original = document.documentElement.clientHeight;
  //add event that resize the page
  window.addEventListener("resize", function() {
    var resizeHeight = document.documentElement.clientHeight;
    $('body').height(original);
    $('#login_display').height(original);
  });
  //===========================================================	

	$("#fbiiingin").click(function(){
	  FB.login(function(response) {
		  statusChangeCallback(response);
 	  }, { scope: 'public_profile,email' });
	});
})













// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
	  FB.api('/me', function(response) {
		  console.log('Successful login for: ' + response.id);
      $.ajax({
        type:"POST",
        url:"/login",
        data:
        {
          user_name: response.id,
          user_password: "fbuser"
        },
        success:function(data)
        {
          console.log("fb login ok " + data);
          window.location = data;
        },
        error:function(){
          console.log("fb login error");
        }
      });
    });
	} else {
		// The person is not logged into your app or we are unable to tell.
		console.log( 'Please log into this app.');
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId      : '207149940007425',
		cookie     : true,  // enable cookies to allow the server to access 
												// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.8' // use graph api version 2.8
	});

	// Now that we've initialized the JavaScript SDK, we call 
	// FB.getLoginStatus().  This function gets the state of the
	// person visiting this page and can return one of three states to
	// the callback you provide.  They can be:
	//
	// 1. Logged into your app ('connected')
	// 2. Logged into Facebook, but not your app ('not_authorized')
	// 3. Not logged into Facebook and can't tell if they are logged into
	//    your app or not.
	//
	// These three cases are handled in the callback function.

//	FB.getLoginStatus(function(response) {
//		statusChangeCallback(response);
//	});

};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	//js.src = 'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v3.0&appId=1682579258515798&autoLogAppEvents=1';
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));










