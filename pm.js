var events = [];
var eventCount = 0;
var buttonCounter = 0;
var currentPageID;
var currentCanvasCount = 0;
var timeDic = {};
var personList = [];
var actionList = [];
var objectList = [];
var storyIndex = 0;
var storyBank = [];
var progress = 0;
// Insert your Dropbox app key here:
var DROPBOX_APP_KEY = '8qw6cevpayp0vyd';

// Exposed for easy access in the browser console.
var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
var taskTable;


function linktoDropBox() {

	client.authenticate();
	/*client.authenticate({ interactive: false}, function (error) {
		if (error) {
			alert('Authentication error: ' + error);
		}
	});
	if (client.isAuthenticated()) {
		alert('hi');
	}
	*/
}
//				$('#home-info').removeClass("ui-disabled");

function signOff() {
	console.log('signing-off...');
	client.signOff();
	$('#home-game').addClass("ui-disabled");
	$('#home-bank').addClass("ui-disabled");
	$('#home-accounts').addClass("ui-disabled");
	location.reload();
}

var emailCount = 0;

function saveForm(e) {
	$('#confirm-info div').html('');
	console.log($('#confirm-info div').html());
	var namesave = $("#name").val();
	if (namesave != '') $("#confirm-info div").append("<p> Name: " + namesave + "</p>");
	var agesave = $("input[type='range']").val();
	if (agesave != '') $("#confirm-info div").append("<p> Age: " + agesave + "</p>");
	var gender = $("input:radio[name='radio-g']:checked").val();
	$("#confirm-info div").append("<p> Gender: " + gender + "</p>");
	var email = $("#email").val();
	if (isEmail(email)) {
		$("#confirm-info div").append("<p> Email: " + email + "</p>");
	} else alert('email not valid');
	var state = $("#states option:selected()").val();
	if (state != '') $("#confirm-info div").append("<p> State: " + state + "</p>");
	alert('Data daved');
	return false;
}
function isEmail(a){
	return a != '' ;///^([\w!.%+\-])+(?:\.[\w\-]+)+$/.test(a);
}

//utility function
String.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {       
		var reg = new RegExp("\\{" + i + "\\}", "gm");             
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
}

function actionHandler(event, web, action) {
	if (event.handled !== true) 
	{
		var actionListResult = "";
		var actionListHead = "<p><img class=clue src='images/action/";
		for (var i = 0; i < action_num; i++) {
			actionListResult += actionListHead + action + (i+1).toString() + ".jpg'</p>";
		}
		var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#accounts>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
		var newPage = $("<div data-role='page' data-title='"+web+action+"' id="+web+action+"><div data-role='header' data-position=fixed><a href=#" + web + "Page data-icon='back'>Back</a><h1>"+action+"</h1></div><div data-role='content' class=images>"+actionListResult+"</div>"+footer+"</div>");
		newPage.appendTo( $.mobile.pageContainer );
		$.mobile.changePage(newPage);
		event.handled = true;
	}
	return false; 
};


function objectHandler(event, web, object) {
	if (event.handled !== true) 
	{
		var objectListResult = "";
		var objectListHead = "<p><img class=clue src='images/object/";
		for (var i = 0; i < object_num; i++) {
			objectListResult += objectListHead + object + (i+1).toString() + ".jpg'</p>";
		}
		var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#accounts>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
		var newPage = $("<div data-role='page' data-title='"+web+object+"' id="+web+object+"><div data-role='header' data-position=fixed><a href=#" + web+"Page data-icon='back'>Back</a><h1>"+object+"</h1></div><div data-role='content' class=images>"+objectListResult+"</div>"+footer+"</div>");
		newPage.appendTo( $.mobile.pageContainer );
		$.mobile.changePage(newPage);
		event.handled = true;
	}
	return false; 
};

function addActionImage(actionName, web){
	//get the webPage referred to	
	var webPage = $('#'+web +"Page");
	//insert image there / get rid of the button
	var action = $('#'+web +"Page").find(".actionButton").text();
	$('#'+web +"Page").find(".actionButton").empty();
	var base = "<p>{0}</p><img class=clue src=images/action/{1}.jpg>"
	var result = String.format(base, action, actionName);
	$('#'+web +"Page").find(".actionButton").html(result);
	//change to that page
	$.mobile.changePage(webPage);
}


function addObjectImage(objectName, web){
	//get the webPage referred to	
	var webPage = $('#'+web +"Page");
	//insert image there / get rid of the button
	var object = $('#'+web +"Page").find(".objectButton").text();
	$('#'+web +"Page").find(".objectButton").empty();
	var base = "<p>{0}</p><img class=clue src=images/object/{1}.jpg>"
	var result = String.format(base, object, objectName);
	$('#'+web +"Page").find(".objectButton").html(result);
	//change to that page
	$.mobile.changePage(webPage);
}


//this function creates the action images page
function createActionImagePage(web, action, action_num) {
	var actionListResult = "";
	var actionListHead = "<p><input type='image' src='images/action/";

	for (var i = 0; i < action_num; i++) {
		var actionName = action + (i+1).toString();
		var actionListMiddle = "value='" + actionName+ "' onclick='addActionImage(\""  + actionName + "\", \"" + web + "\")' ";
		actionListResult += actionListHead + actionName + ".jpg' " + actionListMiddle + "/></p>";
	}
	console.log(actionListResult);
	var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#accounts>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
	var newPage = $("<div data-role='page' data-title='"+web+action+"' id="+web+action+"><div data-role='header' data-position=fixed><a href=#" + web + "Page data-icon='back'>Back</a><h1>"+action+"</h1></div><div data-role='content' class=images>"+actionListResult+"</div>"+footer+"</div>");
	return newPage;
	//newPage.appendTo( $.mobile.pageContainer );
	//$.mobile.changePage(newPage);
}
	

//this function creates the object images page
function createObjectImagePage(web, object, object_num) {
	var objectListResult = "";
	var objectListHead = "<p><input type='image' src='images/object/";

	for (var i = 0; i < object_num; i++) {
		var objectName = object + (i+1).toString();
		var objectListMiddle = "value='" + objectName+ "' onclick='addObjectImage(\""  + objectName + "\", \"" + web + "\")' ";
		objectListResult += objectListHead + objectName + ".jpg' " + objectListMiddle + "/></p>";
	}
	var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#accounts>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
	var newPage = $("<div data-role='page' data-title='"+web+object+"' id="+web+object+"><div data-role='header' data-position=fixed><a href=#" + web+"Page data-icon='back'>Back</a><h1>"+object+"</h1></div><div data-role='content' class=images>"+objectListResult+"</div>"+footer+"</div>");
	return newPage;
	//newPage.appendTo( $.mobile.pageContainer );
	//$.mobile.changePage(newPage);
}

function getCurrentCanvasID() {
	var canvasID = 'photoCanvas' + currentPageID;//currentCanvasCount.toString(); 
	return canvasID;
}
function getNextCanvasID(){
	return 
}

function checkPassword(action) {
	//create a pop-up page to type in the password and do checking
	//var passwordPopup = $("<div data-role='dialog' data-title='generate a password for"+web + "' id="+web+"Password data-transition='pop' >"+"</div>");
	//passwordPopup.appendTo( $.mobile.pageContainer );
 	$.mobile.changePage('#' + action + "Password");
	return


}


function showAlertRight() {
    navigator.notification.alert(
        'Success!',  // message
        alertDismissed,         // callback
        '',            // title
        'Okay'                  // buttonName
  	);
}
function showAlertWrong() {
    navigator.notification.alert(
        'Please use the action and the object!',  // message
        alertDismissed,         // callback
        '',            // title
        'Sure'                  // buttonName
  	);
}

function updateTimeDic(web) {
	alert("update Rehearse Time");
	console.log(timeDic);
	var newtime = new Date();
	timeDic[web] = newtime.getTime();
	$.mobile.changePage("#accounts");
}
function checkPassword2(web) {
	event.preventDefault();

	//create a pop-up page to type in the password and do checking
	//var passwordPopup = $("<div data-role='dialog' data-title='generate a password for"+web + "' id="+web+"Password data-transition='pop' >"+"</div>");
	//passwordPopup.appendTo( $.mobile.pageContainer );
	var webPage = $('#'+web +"Page");
	var password = $('#'+web +"Password").find("#typein-password" + web).val();
	var newpassword = password.toLowerCase();

	//insert image there / get rid of the button
	var action = webPage.find(".actionButton").text();
	var object = webPage.find(".objectButton").text();
	if ((newpassword.indexOf(action)!= -1) && (newpassword.indexOf(object) != -1)){
   		showAlertRight();
 		webPage.find(".private").empty();
 		var base1 = "<p><a data-role='button' href=#accounts >Cancel</a></p>";
		webPage.find(".rehearseButton1").html(base1);
		var base2 = "<p><a data-role='button' href=# onclick=updateTimeDic('" + web + "') >Got it</a></p>";
		webPage.find(".rehearseButton2").html(base2);

 	} else {
 		showAlertWrong();
 		//alert('Please use the action and the object');
 		//$('#'+web +"Password").find("#typein-password" + web).val('');
 	}
 	$.mobile.changePage("#accounts");
	return


}
function changeDisplay(text) {
	$('#gamebeginning').html(text);
}

var gamepersonlist = [];
//generate 10 stories to use later
function generateList() {
	var person_list = ['Angelina_Jolie','Bill_Gates','Einstein','Michelle_Obama','Morgan_Freeman','Mozart', 'Adolf_Hitler', 'Barack_Obama', "Bart_Simpson", 
						"Ben_Affleck", "Beyonce", "Bill_Clinton", "Brad_Pitt","Darth_Vader", "Frodo", "George_W_Bush", "Hillary_Clinton", "Homer_Simpson",
						"Indiana_Jones", "Marilyn_Monroe", "Superman", "Steve_Jobs", "Michael_Jordan"];

	var action_list = ['balancing', 'bending', 'biting', 'bouncing', 'building', 'burning' , 'chasing', 'clapping', 'climbing' ,'cooking', 'digging',
						'drinking', 'enlarging', 'exploding', 'feeding', 'fighting', 'flipping', 'hanging', 'hiding', 'hugging', 'juggling', 'kissing',
						'licking', 'painting', 'piloting', 'pushing', 'repairing', 'rubbing', 'scratching', 'shooting', 'smelling', 'swinging','throwing',
						'tickling', 'tying', 'washing', 'wrapping', 'zooming'];

	var object_list = ['dome','hammer','heel','hen','igloo','leaf', 'lock', 'moose', 'seal', 'smore', 'snowflake','suit','daisy','dice','safe','toilet',
						'moon', 'map','lollipop','peach', 'bus'];

	var scene_list = ['airport', 'baseball_field', 'basketball_court', 'bakery', 'bridge', 'Capitol_Building', 'castle', 'court', 'Eiffel_Tower', 
					  'fancy_house', 'fitness_center', 'forest', 'garden', 'glacier', 'Grand_Canyon', 'Great_Wall', 'hanging_bridge', 'island', 'lake',
					  'library', 'lighthouse', 'mountain', 'Niagara_Falls', 'ocean', 'pool_bar', 'pyramids', 'restaurant', 'swimming_pool', 'Taj_Mahal',
					  'tropical_beach'];
	var gamelist = [];
	var gameobjectlist = [];
	var gameactionlist = [];
	var gamescenelist = [];
	for (var i = 0; i < 10; i++) {
		var person = person_list[Math.floor(Math.random() * person_list.length)];

		while (gamepersonlist.indexOf(person) != -1) {
			var person = person_list[Math.floor(Math.random() * person_list.length)];
		}
		gamepersonlist.push(person);

		var action = action_list[Math.floor(Math.random() * action_list.length)];
		while (gameactionlist.indexOf(action) != -1) {
			var action = action_list[Math.floor(Math.random() * action_list.length)];
		}
		gameactionlist.push(action);

		var object = object_list[Math.floor(Math.random() * object_list.length)];
		while (gameobjectlist.indexOf(object) != -1) {
			var object = object_list[Math.floor(Math.random() * object_list.length)];		
		}
		gameobjectlist.push(object);

		var scene = scene_list[Math.floor(Math.random() * scene_list.length)];
		while (gamescenelist.indexOf(scene) != -1) {
			scene = scene_list[Math.floor(Math.random() * scene_list.length)];
		}
		gamescenelist.push(scene);
		gamelist.push([person, action, object, scene]);

	};

	return gamelist;
}
function startChecking() {
	var curPerson = gamepersonlist[storyIndex];
	var curScene = gamelist[storyIndex][3];
	var html = "<figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
				<figure><img class=clue src=images/scene/{1}.jpg /><figcaption>{2}</figcaption></figure>\
				<span data-role='fieldcontain'><form action='#'>\
				<span><input name='password' autocorrect='off' id='game-password' value='' placeholder='doing what' autofocus='autofocus' tabindex='1'/>\
				<input autocorrect='off' name='password2' id='game-password-b' value='' tabindex='2' placeholder='doing what'/></span>\
				<br><br><div class=halfbuttonDiv><button type='submit' tabindex='3' class=right name='submit; value='submit' onclick='generateNextCheck()' >Check and Next</button>\
				<a href='#' data-role='button' class=left tabindex='4' onclick='forgetStory()'>I Forget</a></div></span></form>";
	$('#gamestories').html(String.format(html, curPerson, curPerson.split('_').join(' '), curScene.toLowerCase(), curScene.replace('_', ' ')));
	getVerbComboBox('game-password');
	getObjectComboBox('game-password-b');
	$( "#gamepage" ).page( "destroy" ).page();
	$('#game-password').focus();


}
var gameScore = 0;


function addStories() {
	for (var i=0; i < 10; i++) {
		storyBank.push(gamelist[i])
	}
	console.log(storyBank.length);
	allPossible = computeCombinations(storyBank, 4);
	$.mobile.changePage('#accounts');


}

function addSelect() {
	$('.image-checkbox-container img').each(function() {
		if (this.style.border != '') {
			console.log($(this).prev());
			var index = parseInt($(this).prev().firstChild.value);
			console.log(index);
			console.log(gamelist[index]);
			storyBank.push(gamelist[index])
		}
	});
	console.log(storyBank.length);
	allPossible = computeCombinations(storyBank, 4);
	$.mobile.changePage('#accounts');

}
function addSomeStories(){
	var html = '';
	var person;
	for (var i = 0; i < 10; i ++) {
		person = gamelist[i][0];
		html = html + "<div class='image-checkbox-container'><input type='checkbox' name='"+person+"Box' value=" + i.toString() + " /><img src='images/person/"+  person + ".jpg' /></div>";
	}
	html += "<input type='submit' value='Submit' onclick='addSelect()'>";
	$('#addStoryForm').html(html);
	$.mobile.changePage('#addStories');
	$( "#addStories" ).page( "destroy" ).page();

}

function onConfirmStory(button) {
	//forgetStory();
	if (button == 1) {
		forgetStory();
	} else {
		//set focus on text
		$('#game-password').focus();

	}
}

function backtoGame() {
	$.mobile.changePage('#gamepage');
	//
	setTimeout(doNothing, 1000);
	$('#game-password').focus();
}
function doNothing(){
	$('#game-password').focus();
}
function showRight() {
	 navigator.notification.alert(
        'Correct Story!',  // message
        doNothing,         // callback
        'Great Job!',            // title
        'Okay3'                  // buttonName
  	);
 }
function showWrong() {
    navigator.notification.confirm(
        'Wrong Story!',  // message
        onConfirmStory,         // callback
        'Wrong Story!',            // title
        'See Answer, Try Again'                  // buttonName
  	);
}

function generateNextCheck() {
	event.preventDefault();

	var password = $('#gamestories').find('#game-password').val();
	var password_b = $('#gamestories').find('#game-password-b').val();
	var newpassword = password.toLowerCase();
	var newpassword_b = password_b.toLowerCase();
	//$('#game-password').blur().focus();

	if (checkIndex == 0) {
		var action = gamelist[sequenceIndex][1];
		var object = gamelist[sequenceIndex][2];
	}
	else {
		var action = gamelist[checkIndex-1][1];
		var object = gamelist[checkIndex-1][2];
	}
	if ((newpassword.indexOf(action)!= -1) && (newpassword_b.indexOf(object) != -1)){
		//alert('correct!');
		progress += 1;
		//showRight();

		$("#checkMark").css('display', 'inline');
		$('#gamestories').css('visibility', 'hidden')
		setTimeout(function() { $("#checkMark").css('display', 'none'); 
								$("#gamestories").css('visibility', 'visible')}, 1000 );
		var p = progress/64.0;
		$('#progress-bar').val(p.toString());
		p = Math.round(p*100);
		$('#progress-val').html( ' ' + p.toString() + '%');
		gameScore += 1;
		if (checkIndex == 1) {
		$('#gamestories').html('<p>Final Score: ' + gameScore.toString() + "/10 </p><p><a data-role='button' href='#' onclick='addSomeStories()'> Add Some</a></p><p><a data-role='button' href='#' onclick='addStories()'> Add All</a></p><p><a data-role='button' href='#' onclick='startGame()'> Try Again</a></p>");

		} else {
			$('#gamestories').find('#game-password').val('');
			//$('#game-password').focus();

			var curPerson = gamepersonlist[checkIndex];
			var curScene = gamelist[checkIndex][3];
			var html = "<figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
						<figure><img class=clue src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure>\
						<span data-role='fieldcontain'><form action='#'>\
						<span><input autocorrect='off' name='password' id='game-password' value='' placeholder='doing what' autofocus='autofocus' tabindex='1'/>\
						<input autocorrect='off' name='password2' id='game-password-b' value='' tabindex='2' placeholder='doing what'/></span>\
						<br><br><div class=halfbuttonDiv><button tabindex='3' class=right type='submit' name='submit; value='submit' onclick='generateNextSequence()' >Check and Next</button>\
						<a href='#' class=left data-role='button' tabindex='4' onclick='forgetStory()'>I Forget</a></div></span></form>";
			$('#gamestories').html(String.format(html, curPerson, curPerson.split('_').join(' '), curScene.toLowerCase(), curScene.replace('_', ' ') ));
			checkIndex += 1;
			getVerbComboBox('game-password');
			getObjectComboBox('game-password-b')
			$( "#gamepage" ).page( "destroy" ).page();
			$('#game-password').focus();
			//$.mobile.changePage("#gamepage");
		}	
	} else {

		//alert('wrong!');
		//showWrong();
		//generateNextCheck();
		//show wrong mark
		document.getElementById("checkMark").src = 'images/wrong.png';
		$("#checkMark").css('display', 'inline');
		$('#gamestories').css('visibility', 'hidden')
		setTimeout(function() { $("#checkMark").css('display', 'none'); 
								$("#gamestories").css('visibility', 'visible');
								document.getElementById("checkMark").src = 'images/check.png'}, 1000 );

	}
	
	
	

}

function forgetStory() {
	var html="<div class=clueDiv><figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
			 is <figure><img class=clue src=images/action/{2}1.jpg /><figcaption>{3}</figcaption></figure>\
			 {8}<figure><img class=clue src=images/object/{4}1.jpg /><figcaption>{5}</figcaption></figure>\
			 in/on<figure><img class=clue src=images/scene/{6}.jpg /><figcaption>the {7}</figcaption></figure></div>";
	if (checkIndex == 0) {
		var cS = gamelist[sequenceIndex];
	} else {
		var cS = gamelist[checkIndex-1];
	}
	if (cS[2] == 'igloo') {
		var article = 'an';
	} else {
		var article = 'a'
	}
	$('#hintSpace').html(String.format(html, cS[0], cS[0].split('_').join(' '), cS[1], cS[1], cS[2], cS[2], cS[3].toLowerCase(), cS[3], article));
	$.mobile.changePage("#gameForget");
}

function generateNextSequence() {
	event.preventDefault();
	//generate next story

	if (storyIndex <= sequenceIndex) {
		if (storyIndex == 0) {
			var html="<div class=clueDiv><figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
					 is <figure><img class=clue src=images/action/{2}1.jpg /><figcaption>{3}</figcaption></figure>\
					 {8}<figure><img class=clue src=images/object/{4}1.jpg /><figcaption>{5}</figcaption></figure> \
					 in/on<figure><img class=clue src=images/scene/{6}.jpg /><figcaption>the {7}</figcaption></figure></div>\
					 <div><a href='#' tabindex='1' data-role='button' onclick='generateNextSequence();' >Next</a></div>";
			var cS = gamelist[storyIndex];
			if (cS[2] == 'igloo') {
				var article = 'an';
			} else {
				var article = 'a'
			}
			$('#gamestories').html(String.format(html, cS[0], cS[0].split('_').join(' '), cS[1], cS[1], cS[2], cS[2], cS[3], cS[3], article));
			$.mobile.changePage("#gamepage");
			storyIndex += 1;
			$( "#gamepage" ).page( "destroy" ).page();

		} else {
		generateNextStory();
		$( "#gamepage" ).page( "destroy" ).page();
		}
	}
	//generate next check
	else if ((storyIndex > sequenceIndex) && (checkIndex <= sequenceIndex )) {
		if (checkIndex == -1) {
			var curPerson = gamepersonlist[sequenceIndex];
			var curScene = gamelist[sequenceIndex][3];
			var html = "<figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
						<figure><img class=clue src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure>\
						<span data-role='fieldcontain'><form action='#'>\
						<span><input type='text' autocorrect='off' name='password' id='game-password' value='' placeholder='doing what' autofocus='autofocus' tabindex='1'/>\
						<input type='text' autocorrect='off' name='password2' id='game-password-b' value='' placeholder='doing what' tabindex='2'/></span>\
						<br><br><div class=halfbuttonDiv><button type='submit' class=right name='submit' value='submit' onclick='generateNextSequence()' tabindex='3'>Check and Next</button>\
						<a href='#' class=left data-role='button' tabindex='4' onclick='forgetStory()'>I Forget</a></div></span></form>";
			$('#gamestories').html(String.format(html, curPerson, curPerson.split('_').join(' '), curScene.toLowerCase(), curScene.replace('_', ' ')));
			checkIndex +=1;
			gameScore = -1;
			getVerbComboBox('game-password');
			getObjectComboBox('game-password-b');
			$( "#gamepage" ).page( "destroy" ).page();
			$('#game-password').focus();

		} else if ((checkIndex == 0) && (sequenceIndex == 0)){
			var curPerson = gamepersonlist[0];
			var curScene = gamelist[0][3];
			var html = "<figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
						<figure><img class=clue src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure>\
						<span data-role='fieldcontain'><form action='#'>\
						<span><input type='text' autocorrect='off' name='password' id='game-password' value='' placeholder='doing what' autofocus='autofocus'tabindex='1'/>\
						<input type='text' autocorrect='off' name='password2' id='game-password-b' value='' placeholder='doing what'tabindex='2'/></span>\
						<br><br><div class=halfbuttonDiv><button type='submit' class=right name='submit' value='submit' tabindex='3' onclick='generateNextSequence()' >Check and Next</button>\
						<a href='#' class=left data-role='button' tabindex='4' onclick='forgetStory()'>I Forget</a></div></span></form>";
			$('#gamestories').html(String.format(html, curPerson, curPerson.split('_').join(' '), curScene.toLowerCase(), curScene.replace('_', ' ')));
			checkIndex +=1;
			getVerbComboBox('game-password');
			getObjectComboBox('game-password-b')
			$( "#gamepage" ).page( "destroy" ).page();
			$("#game-password").focus();

		}
		else {
		generateNextCheck();
		}

	}
	else {
		if (checkIndex == 10) {
			generateNextCheck();
		} else if (checkIndex > sequenceIndex) {
			sequenceIndex += 1;
			//storyIndex = 0;
			//for current scoing
			event.preventDefault();
			$('#game-password').focus();
			var password = $('#gamestories').find('#game-password').val();
			var password_b = $('#gamestories').find('#game-password-b').val();
			var newpassword = password.toLowerCase();
			var newpassword_b = password_b.toLowerCase();
			var action = gamelist[checkIndex-1][1];
			var object = gamelist[checkIndex-1][2];
			if ((newpassword.indexOf(action)!= -1) && (newpassword_b.indexOf(object) != -1)){
				//alert('correct!');
				progress += 1;
				//$("#checkMark").css('visibility', 'visible');
				$("#checkMark").css('display', 'inline');
				$('#gamestories').css('visibility', 'hidden')
				setTimeout(function() { $("#checkMark").css('display', 'none'); 
										$("#gamestories").css('visibility', 'visible')}, 1000 );
				//setTimeout(function() { $("#checkMark").css('visibility', 'hidden'); }, 1000 );
				var p = progress/64.0;
				//$( ".progressbar" ).progressbar({ value: 50 });
				$('#progress-bar').val(p.toString());
				p = Math.round(p*100);
				$('#progress-val').html( ' ' + p.toString() + '%');

				//showRight();
				checkIndex = -1;
				gameScore += 1;
				generateNextSequence();
			} else {
				//alert('wrong2!');
				//showWrong();
				sequenceIndex -= 1;
				document.getElementById("checkMark").src = 'images/wrong.png';
				//$('#checkMark').src = 'images/wrong.png';
				$("#checkMark").css('display', 'inline');
				$('#gamestories').css('visibility', 'hidden')
				setTimeout(function() { $("#checkMark").css('display', 'none'); 
										$("#gamestories").css('visibility', 'visible');
										document.getElementById("checkMark").src = 'images/check.png';
										}, 1000 );
				//document.getElementById("checkMark").src = 'images/check.png';

			}
			$( "#gamepage" ).page( "destroy" ).page();
		}
	}
	
}
function generateNextStory() {
	var cS = gamelist[storyIndex];
	var html="<div><figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
			 is<figure><img class=clue src=images/action/{2}1.jpg /><figcaption>{3}</figcaption></figure>\
			 {8}<figure><img class=clue src=images/object/{4}1.jpg /><figcaption>{5}</figcaption></figure>\
			 in/on<figure><img class=clue src=images/scene/{6}.jpg /><figcaption>the {7}</figcaption></figure>\
			 </div><div><a href='#' data-role='button' tabindex='1' onclick='generateNextSequence();' >Next</a></div>";
	if (cS[2] == 'igloo') {
		var article = 'an';
	} else {
		var article = 'a'
	}
	$('#gamestories').html(String.format(html, cS[0], cS[0].split('_').join(' '), cS[1], cS[1], cS[2], cS[2], cS[3].toLowerCase(), cS[3].replace('_' ,' '), article));
	storyIndex += 1;

	//$.mobile.changePage("#gamepage");

}
var gamelist;
var gamepersonlist;
var sequenceIndex;
var checkIndex;
//start the memory game
function startGame() {
	storyIndex = 0;
	checkIndex = 0;
	sequenceIndex = 0;
	gameScore = 0;
	gamepersonlist = [];
	gamelist=[];
	//ready?
	//var myVar=window.setTimeout(function(){changeDisplay('<p>Ready?<p>')},1000);

	//Step1: first generate the 10-story list
	gamelist = generateList();
	console.log(gamelist);

	//while (sequenceIndex != 9) {
		generateNextSequence();
	//	sequenceIndex += 1;
	/*	
	if (storyIndex == 8) {
		//end of storylist
		var html="<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /></div><p>is</p>{2}<div class=actionDiv><img class=clue src=images/action/{3}1.jpg /></div><p>a/an</p> <p>{4}</p><div class=objectDiv><img class=clue src=images/object/{5}1.jpg /></div><a href='#' data-role='button' onclick='startChecking();' >Finish</a>";

	} else {
		//more to come
		var html="<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /></div><p>is</p>{2}<div class=actionDiv><img class=clue src=images/action/{3}1.jpg /></div><p>a/an</p> <p>{4}</p><div class=objectDiv><img class=clue src=images/object/{5}1.jpg /></div><a href='#' data-role='button' onclick='generateNextStory();' >Next</a>";
	}

	var cS = gamelist[storyIndex];
	$('#gamestories').html(String.format(html, cS[0], cS[0], cS[1], cS[1], cS[2], cS[2]));
	$.mobile.changePage("#gamepage");
	*/
	//}
}
function changePerson(person, web) {
	var person_list = ['Angelina_Jolie','Bill_Gates','Einstein','Michelle_Obama','Morgan_Freeman','Mozart', 'Adolf_Hitler', 'Barack_Obama', "Bart_Simpson", 
						"Ben_Affleck", "Beyonce", "Bill_Clinton", "Brad_Pitt","Darth_Vader", "Frodo", "George_W_Bush", "Hillary_Clinton", "Homer_Simpson",
						"Indiana_Jones", "Marilyn_Monroe", "Superman", "Steve_Jobs", "Michael_Jordan"];

	var newperson = person_list[Math.floor(Math.random() * person_list.length)];

	while (personList.indexOf(newperson) != -1) {
		newperson = person_list[Math.floor(Math.random() * person_list.length)];
	}
	personList.push(newperson);
	document.getElementById(web+'Person').src = "images/person/" + newperson + '.jpg';
	$('#' + web + 'Name').html(newperson);

}
//end of utility function
var existingAccounts=[];
var allIndex = 0

function getImages2(web, useMyOwn) {
	console.log(allPossible);

	var possible = allPossible[Math.floor(Math.random() * allPossible.length)];
	while (existingAccounts.indexOf(possible) != -1) {
		possible = allPossible[Math.floor(Math.random() * allPossible.length)];
	}
	existingAccounts.push(possible);
	var head = "<div class='checkMarkDiv'><img src='images/check.png' id='" + web + "checkMark'/></div>";
	var html = head + "<div id='" + web + "Stories'>";
	//var html = "<div id='" + web + "Stories'><ul = data-role='listview'>"
	for (var i=0; i < possible.length; i ++) {
		//var liold = '<li><a href="#"><img src="images/person/{0}.jpg" />{1}</a><li>'
		if (i % 2 == 0) {
			var liold = "<div class=twoPairs><span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
					 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure></span>";
		}
		else {
			var liold = "       &nbsp&nbsp<span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
					 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure></span></div>";
			}
		var li = String.format(liold, possible[i][0], possible[i][0], possible[i][3].toLowerCase(), possible[i][3]);
		html += li;
	}
	html += "</div><br><input type='text' autocorrect='off' name='password' id='"+web+"-password' value='' placeholder='Type in your password' autofocus='autofocus'/>\
			<a href=# data-role='button' data-rel='popup' onclick='checkPasswordNew(\""  + web + "\", " + allIndex + ")' > Type in your Password</a>"
	allIndex+=1;	
	console.log(possible);
	return html;
}
function showPopupRight(web) {
	alert('correct');
	//$('#successPage').dialog();
	$("#" + web + "checkMark").css('display', 'inline');
	$('#' + web + "Stories").css('visibility', 'hidden')
	setTimeout(function() { $("#" + web + "checkMark").css('display', 'none'); 
							$('#' + web + "Stories").css('visibility', 'visible');
							document.getElementById(web+"checkMark").src = 'images/check.png'}, 1000 );
}
function showPopupWrong(web) {
	alert('wrong');
	document.getElementById(web+"checkMark").src = 'images/wrong.png';
	$($('#' + web + "checkMark")).css('display', 'inline');
	$($('#' + web + "Stories")).css('visibility', 'hidden');
	setTimeout(function() { $('#' + web + "checkMark").css('display', 'none'); 
							$('#' + web + "Stories").css('visibility', 'visible');
							document.getElementById(web+"checkMark").src = 'images/check.png'}, 1000 );

}

function checkPasswordNew(web, index) {
	var answer = existingAccounts[index];
	var guess = $('#' + web + 'Page').find('#' + web+'-password').val(); 
	for (var i=0; i < answer.length; i ++) {
		if ((guess.indexOf(answer[i][1]) == -1) || (guess.indexOf(answer[i][2]) == -1)) {
			//passwork wrong
			showPopupWrong(web);
			return;
		}
	}
	showPopupRight(web);
}

function getImages(web, useMyOwn) {
	//how to generate /where to list
	var person_list = ['Angelina_Jolie','Bill_Gates','Einstein','Michelle_Obama','Morgan_Freeman','Mozart', 'Adolf_Hitler', 'Barack_Obama', "Bart_Simpson", 
						"Ben_Affleck", "Beyonce", "Bill_Clinton", "Brad_Pitt","Darth_Vader", "Frodo", "George_W_Bush", "Hillary_Clinton", "Homer_Simpson",
						"Indiana_Jones", "Marilyn_Monroe", "Superman", "Steve_Jobs", "Michael_Jordan"];

	var action_list = ['balancing', 'bending', 'biting', 'bouncing', 'building', 'burning' , 'chasing', 'clapping', 'climbing' ,'cooking', 'digging',
						'drinking', 'enlarging', 'exploding', 'feeding', 'fighting', 'flipping', 'hanging', 'hiding', 'hugging', 'juggling', 'kissing',
						'licking', 'painting', 'piloting', 'pushing', 'repairing', 'rubbing', 'scratching', 'shooting', 'smelling', 'swinging','throwing',
						'tickling', 'tying', 'washing', 'wrapping', 'zooming'];

	var object_list = ['dome','hammer','heel','hen','igloo','leaf', 'lock', 'moose', 'seal', 'smore', 'snowflake','suit','daisy','dice','safe','toilet',
						'moon', 'map','lollipop','peach', 'bus'];

	var action_num = 3;
	var object_num = 3;


	var person = person_list[Math.floor(Math.random() * person_list.length)];

	while (personList.indexOf(person) != -1) {
		var person = person_list[Math.floor(Math.random() * person_list.length)];
	}
	personList.push(person);

	var action = action_list[Math.floor(Math.random() * action_list.length)];
	while (actionList.indexOf(action) != -1) {
		var action = action_list[Math.floor(Math.random() * action_list.length)];
	}
	actionList.push(action);

	var object = object_list[Math.floor(Math.random() * object_list.length)];
	while (objectList.indexOf(object) != -1) {
		var object = object_list[Math.floor(Math.random() * object_list.length)];
	}
	objectList.push(object);
	//html = "<p>{0}</p><img class=clue src=images/person/{1}.jpg><p>is</p><p>{2}</p><p>a/an</p><p>{3}.</p>"
	

	//action button
	var webPageIdDOM = '#' + web + 'Page';
	var actionPageIdDOM = '#' + web + action;
	var objectPageIdDOM = '#' + web + object;
	if (useMyOwn) {
		var canvas = '<img style="display:none;width:80px;height:80px; margin:0px auto" class="ownPhotos" id=photoCanvas' + web + ' src="" />'
	//<img style="display:none;" id="largeImage" src="" />
		var html = "<div class=rehearseButton1></div>" + canvas + "<div class='private'><p>is</p>{2} a/an {3} <a href=# id='fix' data-role='button' data-rel='popup' onclick='checkPassword(\""  + web + "\")' > Type in your Password</a> </div><div class=rehearseButton2></div>";
	} else {
		//var popupPage = $("<div data-role='popup' data-title='generate a password for"+web + "' id="+web+"Password > PASSWORD </div>");
		//popupPage.appendTo( $.mobile.pageContainer );

		//var html = "<p>{0}</p><img class=clue src=images/person/{1}.jpg /><p>is</p>{2} a/an {3} <div data-role='popup' data-title='generate a password for"+web + "' id="+web+"Password > PASSWORD </div> <a data-role='button' data-rel='popup' href=#amazonPassword"+ " data-transition='pop' data-position-to='window'>Type in your Password</a>";//" onclick='checkPassword(\""  + action + "\", \"" + web + "\", \"" + object + "\")' data-rel='dialog'>Type in your Password</a>";
		var html = "<div class=rehearseButton1></div><p id="+ web + "Name >{0}</p><div class=personDiv><img class=clue id=" + web + "Person src=images/person/{1}.jpg /></div><div class='private'><a data-role='button' onclick='changePerson(\"" + person + '","' + web + "\")'>Change Person</a><p>is</p>{2} a/an {3} <a href=# id='fix' data-role='button' data-rel='popup' onclick='checkPassword(\""  + web + "\")' > Type in your Password</a></div><div class=rehearseButton2></div>";

	}

	var buttonActionId = 'buttonAction' + buttonCounter.toString();
	var buttonObjectId = 'buttonObject' + buttonCounter.toString();
	buttonCounter += 1;

	//var buttonAction = "<input type='button' id='" + buttonActionId + "' value='" + action + "' href='" + actionPageIdDOM + "' />";
	//var buttonObject =  "<input type='button' id='" + buttonObjectId + "' value='" + object + "' href='" + objectPageIdDOM + "' />";
	var buttonObject = "<div class=objectButton><a data-role='button' href=" + objectPageIdDOM + ">" + object + "</a></div>";
	var buttonAction = "<div class=actionButton><a data-role='button' href=" + actionPageIdDOM + ">" + action + "</a></div>";


	//var actionLambda = function (event) {  };
	//var objectLambda = function (event) { objectHandler(event, web, object); };

	var buttonActionIdDOM = '#' + buttonActionId;
	var buttonObjectIdDOM = '#' + buttonObjectId;

	//create two pages and then bind the buttons
	var actionPage = createActionImagePage(web, action, action_num);
	var objectPage = createObjectImagePage(web, object, object_num);

	
	actionPage.appendTo( $.mobile.pageContainer );
	objectPage.appendTo( $.mobile.pageContainer );

	//var objectLambda = function (event) {alert('hi');$.mobile.changePage($(objectPageIdDOM));} ;
	//var actionLambda = function (event) {$.mobile.changePage($(actionPageIdDOM))} ;

	$(buttonObjectId).live('click', function(event){});
	//$(buttonObjectId).live('click', objectLambda);
	//$(buttonActionId).live('click', actionLambda);
	return String.format(html, person, person, buttonAction, buttonObject);//person, action, object);
	//return "<p><img class=clue src=images/pic"+pic1+".jpg></p><p><img class=clue src=pictures/pic"+pic2+".jpg></p><p><img class=clue src=pictures/pic"+pic3+".jpg></p>"
}
function submit(e){
	console.log('sumbit!!!');
	if (((e.keyCode === 13) || (e.keyCode == undefined)) && ($("#entry:focus"))) {
		e.preventDefault();
		//if pass validation of data
		var useMyOwn = document.getElementById('checkbox-2').checked;
		var keyid = 'button' + emailCount;
		var value = $('#account-name').val();
		$('#account-name').val('');
		if (isEmail(value)) {
			var estring = 'list'+emailCount;
			var jbuttonid = '#' + keyid;
			var listid = '#' +estring;
			$("#list").append("<li id="+value+ "><a href=#"+value+"Page id="+keyid+" data-wrapperels='span' data-inline='true' data-icon='delete' data-iconpos='right' data-theme='a'>" + value + "</a></li>");
			$('#list').listview('refresh');
			emailCount += 1;
			//add to confirm tap
			$("#confirm-friends div").append("<p>" + value + "</p>");
			$('#confirm-friend').collapsible('refresh');
			//var images = getImages(value, useMyOwn);
			var images = getImages2(value, useMyOwn);
			var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#accounts>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
			var newPage = $("<div data-role='page' data-title='"+value+"' id="+value+"Page><div data-role='header' data-position=fixed><a href=#accounts data-icon='back'>Back</a><h1>"+ value + "</h1></div><div data-role='content' class=images>"+images+" </div>"+footer+"</div>");
			var popupPage = $("<div data-role='page' data-trasntion='pop' data-rel='pop' data-title='generate a password for"+value + "' id="+value+"Password ><div data-role='fieldcontain'><form action='#' id='passwordChecking'><div><input type='text' autocorrect='off' name='password' id='typein-password" + value + "' value='' placeholder='Type in your password' autofocus='autofocus'/></div><button type='submit' name='submit; value='submit' id='passwordSubmit" + value + "' onclick='checkPassword2(\""  + value + "\")' >Check</button></form></div></div>");
			$('.images').css('text-align','center');
			var copy = new Date();
			timeDic[value] = copy.getTime();
			newPage.appendTo( $.mobile.pageContainer );
			popupPage.appendTo( $.mobile.pageContainer);
			currentPageID = value;
			if (useMyOwn) {
				$.mobile.changePage($("#camera"));

				return false;
			}
			
			$.mobile.changePage(newPage);
			console.log('page changed');
		}

	} else {
		alert('email not valid');
	}
	return false;
}
$( document ).ready(function(){
	var emaiList = $('#accountsList');
	var sbutton = $('#submit');
	$('#accountsList').submit(submit);
	$('.image-checkbox-container img').live('click', function(){
	if (!$(this).prev().prop('checked')) {
		if(!$(this).prev('input[type="checkbox"]').prop('checked')){
        $(this).prev().prop('checked', true);
        console.log($(this).prev());
        this.style.border = '4px solid #38A';
        this.style.margin = '0px';
    } else{
        $(this).prev().prop('checked', false);
        this.style.border = '0px';
        this.style.margin = '4px';
    }});
    //show story bank
    $('#bank').bind("pageshow", function() {
    	console.log(storyBank);
    	if (storyBank.length != 0) {
    		//generate story page
    		var listHTML = '<div id="bankStories"><ul data-role="listview" data-inset="true">'
    		for (var i =0; i < storyBank.length; i++ ){
    			var li = '<li><a href="#" ><img src="images/person/{0}.jpg"><p>{1}</p></a></li>'
    			var newli = String.format(li, storyBank[i][0], storyBank[i][0]);
	    		listHTML += newli;
	    	}
	    	listHTML += "</ul></div>"
	   	$('#banklist').html(listHTML);
	   	$("#bankStories").listview().listview("refresh");
    	}
    });

    //DROPBOX FUNCTIONS
    function insertTask(text) {
		taskTable.insert({
			taskname: text,
			created: new Date(),
			completed: false
		});
	}

	// updateList will be called every time the table changes.
	function updateList() {
		$('#tasks').empty();

		var records = taskTable.query();

		// Sort by creation time.
		records.sort(function (taskA, taskB) {
			if (taskA.get('created') < taskB.get('created')) return -1;
			if (taskA.get('created') > taskB.get('created')) return 1;
			return 0;
		});

		// Add an item to the list for each task.
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			$('#tasks').append(
				renderTask(record.getId(),
					record.get('completed'),
					record.get('taskname')));
		}

		addListeners();
		$('#newTask').focus();
	}
    $('#loginButton').click(function (e) {
		e.preventDefault();
		// This will redirect the browser to OAuth login.
		client.authenticate();
	});

	// Try to finish OAuth authorization.
	client.authenticate({interactive:false}, function (error) {
		if (error) {
			alert('Authentication error: ' + error);
		}
	});

	if (client.isAuthenticated()) {
		// Client is authenticated. Display UI.
		$('#loginButton').hide();
		$('#main').show();
		$('#home-game').removeClass("ui-disabled");
		$('#home-bank').removeClass("ui-disabled");
		$('#home-accounts').removeClass("ui-disabled");
		client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
			if (error) {
				alert('Error opening default datastore: ' + error);
			}

			taskTable = datastore.getTable('tasks');

			// Populate the initial task list.
			updateList();

			// Ensure that future changes update the list.
			datastore.recordsChanged.addListener(updateList);
			$('#home-words').html('Welcome Back!');
			$('#dropboxButton').hide();
		});
	}
	
	// Set the completed status of a task with the given ID.
	function setCompleted(id, completed) {
		taskTable.get(id).set('completed', completed);
	}

	// Delete the record with a given ID.
	function deleteRecord(id) {
		taskTable.get(id).deleteRecord();
	}

	// Render the HTML for a single task.
	function renderTask(id, completed, text) {
		return $('<li>').attr('id', id).append(
				$('<button>').addClass('delete').html('&times;')
			).append(
				$('<span>').append(
					$('<button>').addClass('checkbox').html('&#x2713;')
				).append(
					$('<span>').addClass('text').text(text)
				)
			)
			.addClass(completed ? 'completed' : '');
	}

	// Register event listeners to handle completing and deleting.
	function addListeners() {
		$('span').click(function (e) {
			e.preventDefault();
			var li = $(this).parents('li');
			var id = li.attr('id');
			setCompleted(id, !li.hasClass('completed'));
		});

		$('button.delete').click(function (e) {
			e.preventDefault();
			var id = $(this).parents('li').attr('id');
			deleteRecord(id);
		});
	}

	// Hook form submit and add the new task.
	$('#addForm').submit(function (e) {
		e.preventDefault();
		if ($('#newTask').val().length > 0) {
			insertTask($('#newTask').val());
			$('#newTask').val('');
		}
		return false;
	});

	$('#newTask').focus();



});


function getObjectComboBox(id) {
	$('#' + id).kendoComboBox({
    	dataTextField: "text",
    	dataValueField: "value",
        dataSource: [
        { text: "bus", value: "bus" },
        { text: "daisy", value: "daisy" },
        { text: "dice", value: "dice"},
        { text: "dome", value: "dome" },
        { text: "hammer", value: "hammer" },
        { text: "heel", value: "heel" },
        { text: "hen", value: "hen"},
        { text: "igloo", value: "igloo" },
        { text: "leaf", value: "leaf"},
        { text: "lock", value: "lock"},
        { text: "lollipop", value: "lollipop" },
        { text: "map", value: "map" },
        { text: "moon", value: "moon"},
        { text: "moose", value: "moose" },
        { text: "peach", value: "peach" },
        { text: "safe", value: "safe" },
        { text: "seal", value: "seal"},
        { text: "smore", value: "smore" },
        { text: "snowflake", value: "snowflake"},
        { text: "suit", value: "suit"},
        { text: "toilet", value: "toilet" },
        ],
        filter: "startswith",
        suggest: true,
        placeholder: "What?"
    });
}
function getVerbComboBox(id) {
	$('#' + id).kendoComboBox({
    	dataTextField: "text",
    	dataValueField: "value",
        dataSource: [
        { text: "balancing", value: "balancing" },
        { text: "bending", value: "bending" },
        { text: "biting", value: "biting"},
        { text: "bouncing", value: "bouncing" },
        { text: "building", value: "building" },
        { text: "burning", value: "burning"},
        { text: "chasing", value: "chasing" },
        { text: "clapping", value: "clapping"},
        { text: "climbing", value: "climbing" },
        { text: "cooking", value: "cooking"},
        { text: "digging", value: "digging"},
        { text: "drinking", value: "drinking" },
        { text: "enlarging", value: "enlarging" },
        { text: "exploding", value: "exploding"},
        { text: "feeding", value: "feeding" },
        { text: "fighting", value: "fighting" },
        { text: "flipping", value: "flipping" },
        { text: "hanging", value: "hanging"},
        { text: "hiding", value: "hiding" },
        { text: "hugging", value: "hugging"},
        { text: "juggling", value: "juggling"},
        { text: "kissing", value: "kissing" },
        { text: "licking", value: "licking" },
        { text: "painting", value: "painting"},
        { text: "piloting", value: "piloting" },
        { text: "pushing", value: "pushing" },
        { text: "repairing", value: "repairing" },
        { text: "rubbing", value: "rubbing"},
        { text: "scratching", value: "scratching" },
        { text: "shooting", value: "shooting"},
        { text: "smelling", value: "smelling"},
        { text: "swinging", value: "swinging" },
        { text: "throwing", value: "throwing" },
        { text: "tickling", value: "tickling"},
        { text: "tying", value: "tying" },
        { text: "washing", value: "washing" },
        { text: "wrapping", value: "wrapping" },
        { text: "zooming", value: "zooming"},
        ],
        filter: "startswith",
        suggest: true,
        placeholder: "Doing?"
    });
}

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64-encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById('photoCanvas' + currentPageID);

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  //alert(1);
  var largeImage = document.getElementById('photoCanvas' + currentPageID);

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = "data:image/jpeg;base64," + imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
    destinationType: destinationType.DATA_URL });
  $.mobile.changePage($("#" + currentPageID + 'Page'));  
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, allowEdit: true,
    destinationType: destinationType.DATA_URL });
  $.mobile.changePage($("#" + currentPageID + 'Page'));  

}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
  $.mobile.changePage($("#" + currentPageID + 'Page'));  

}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}

function alertDismissed() {
    // do something

}

// Show a custom 

//
function showAlert() {
    navigator.notification.alert(
        'Time to Rehearse!',  // message
        alertDismissed,         // callback
        'Rehearse',            // title
        'Got it'                  // buttonName
  	);
}


function playBeep() {
    navigator.notification.beep(3);
}

// Vibrate for 2 seconds
//
function vibrate() {
    navigator.notification.vibrate();

}


//compute all possible hashes
function computeHash(){
	var k = 6;
	//all permutations of length 6; compute the hash and story them
	var allResult = computeCombinations(storyBank, 6);
}
//bank and rehearse schedule

function computeCombinations(bank, k) {
	if (bank.length < k) {
		return [[]]
	} else if (bank.length == k) {
		return [bank]
	} else if (k == 1) {
		var newB = [];
		for (var i=0; i < bank.length; i++) {
			newB.push([bank[i]]);
		}
		return newB;

	} else {
		var allperm = []
		var result1 = computeCombinations(bank.slice(1), k-1);
		var result2 = computeCombinations(bank.slice(1), k);
		for (var i = 0; i < result1.length ; i++) {   
			//sconsole.log([bank[0]]+ result1[i]);
			allperm.push([bank[0]].concat(result1[i]));
		}
		for (var j =0; j < result2.length; j ++) {
			allperm.push(result2[j]);
		}
		return allperm;

	}
	
}
