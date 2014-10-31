//var s = document.createElement('script');
//s.src = chrome.extension.getURL('cont.js');
//(document.head||document.documentElement).appendChild(s);
//s.onload = function() {
    //s.parentNode.removeChild(s);
//};

//search window for password fields and user name fields

//something involving cache 
//var domainCache = [];
// function getDomainCache(a) {
// 	try {
// 		if (typeof domainCache[a] != "undefined") return domainCache[a];
// 		var b = typeof punycode != "undefined" ? 
// 	}

// } 

function isPasswordInputField(inputElement) {
	//check not null and type not hidden 
	if (document == null || inputElement == null || 
			inputElement.tagName != "INPUT" || inputElement.type == "hidden") 
		return false;

	//check by role?
	//special cases like facebook.com & tdbank.com loaded from cache
	//password passcode
	return ((inputElement.type == "text" || inputElement.type == "password") && 
			(inputElement.name.toLowerCase().indexOf("pass") >= 0 || 
			inputElement.name.toLowerCase().indexOf("pwd") >= 0 ||
			inputElement.id.toLowerCase().indexOf("pass") >=0 ||
			inputElement.id.toLowerCase().indexOf("pwd") >= 0||
			inputElement.placeholder.toLowerCase().indexOf("password") == 0)
			)
}

function checkInputFields() {
	var input;
	var inputList = document.getElementsByTagName("INPUT");
	for (var i=0; i<inputList.length; i++) {
		input = inputList[i];
		if (isPasswordInputField(input)) {
			input.style.background = "black";
			input.style.color = "white";
			console.log(input);
		}
	}
}

if (window == top) {
	//checkInputFields();
	chrome.runtime.sendMessage("request", checkInputFields);
}
function passwordFieldFocus(){
}
//check originally focused item? rg. BOA
document.addEventListener("focus", function(e) {
	console.log(e);
	console.log(e.target);
	if (isPasswordInputField(e.target)) {
		var iframeElement = document.createElement("iframe");
		iframeElement.id = "passwordBoxIframe";
		iframeElement.src = "overlayBar.html";
		document.body.appendChild(iframeElement);
	}

}, true); //not for IE 
