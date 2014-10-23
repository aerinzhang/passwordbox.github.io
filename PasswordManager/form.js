$(document).ready(function(){
	//var form = document.forms[0];
	//$('addsiteform').addEventListener('submit', function() {alert('hi');});
	//$("submit").click(function() {
	//	alert('oh no');
	//}		

	//set image 


	document.getElementById("addsiteform").getElementsByTagName('img')[0].src ='pics/pic' + chrome.extension.getBackgroundPage().GB.nextNum.toString() + '.jpg';

	document.getElementById('addsiteform').addEventListener('submit', 
	function(){
		var form = document.forms["addsiteform"];
		var domain_name = form['domain'].value;
		var img_source = document.getElementById("addsiteform").getElementsByTagName('img')[0].src;

		var namelist = img_source.split("/").slice(-2);
		var kkk = namelist.join("/");
		chrome.extension.getBackgroundPage().GB.nextNum += 1;
		chrome.extension.getBackgroundPage().GB.addBlockedSite(domain_name, kkk);
		var d = new Date();
		var n = d.getTime();
		chrome.extension.getBackgroundPage().GB.addTime(domain_name, n);
		self.close();

	});//chrome.extension.getBackgroundPage().GB.submitForm($('#addsiteform')));

});