var events = [];
var TAP = 0;
var SWIPE = 1;
var glist = [[0,0,1,1], [0,1,0,1], [1,0,1,0], [1,1,0,0], [0,1,1,0], [1,0,0,1]];
var gesture;
var eventCount = 0;
var buttonCounter = 0;
var currentPageID;
var currentCanvasCount = 0;
var timeDic = {};
var personList = [];
var storyIndex = 0;
//check given gestures are the same as the performed ones         
function checkGes(perform, ges) {
	console.log(perform);
	console.log(ges);
	for (var k=0; k<4; k++){
		if (perform[k] !== ges[k]) {
			return false;
		}
	}
	return true;
}

function reportEvent(event) {
	console.log("Event occurred, event.type = " + event.type);
	var reportDiv = $('#reportAct');
	if (eventCount > 4) {
		eventCount = 0;
	} else {
		var num = (event.type === 'tap') ? 1 : 0;
		events.push(num);
		console.log(num);
		eventCount += 1;
		if (eventCount == 4) {
			if (checkGes(events, gesture)){
				//pass PC 
				$('#home-info').removeClass("ui-disabled");
				$('#home-frie').removeClass("ui-disabled");
				$('#home-conf').removeClass("ui-disabled");
				$('#PC-info').removeClass("ui-disabled");
				$('#PC-frie').removeClass("ui-disabled");
				$('#PC-conf').removeClass("ui-disabled");
				$.mobile.changePage("#info");
			} else {
				//fail PC return to home & reset PC
				gesture = glist[Math.floor(Math.random()*6)];
				var msg2 = "";
				for (var i = 0; i < gesture.length; i++) {
					if (gesture[i] === 1) msg2 += 'tap ';
					else msg2 += "swipe ";
				}
				msg2 +='<br>';
				$("#acts").html(msg2);
				$.mobile.changePage("#home");
			}
			events = [];
			eventCount = 0;
		}
	}

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
		var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#friends>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
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
		var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#friends>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
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
	var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#friends>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
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
	var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#friends>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
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
	$.mobile.changePage("#friends");
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
 		var base1 = "<p><a data-role='button' href=#friends >Cancel</a></p>";
		webPage.find(".rehearseButton1").html(base1);
		var base2 = "<p><a data-role='button' href=# onclick=updateTimeDic('" + web + "') >Got it</a></p>";
		webPage.find(".rehearseButton2").html(base2);

 	} else {
 		showAlertWrong();
 		//alert('Please use the action and the object');
 		//$('#'+web +"Password").find("#typein-password" + web).val('');
 	}
 	$.mobile.changePage("#friends");
	return


}
function changeDisplay(text) {
	$('#gamebeginning').html(text);
}

var gamepersonlist = []
//generate 10 stories to use later
function generateList() {
	var person_list = ['Angelina_Jolie','Bill_Gates','Einstein','Michelle_Obama','Morgan_Freeman','Mozart', 'Adolf_Hitler', 'Barack_Obama', "Bart_Simpson", 
						"Ben_Affleck", "Beyonce", "Bill_Clinton", "Brad_Pitt","Darth_Vader", "Frodo", "George_W_Bush", "Hillary_Clinton", "Homer_Simpson"];

	var action_list = ['balancing', 'bending', 'biting', 'bouncing', 'building', 'burning' , 'chasing', 'clapping', 'climbing' ,'cooking', 'digging',
						'drinking', 'enlarging', 'exploding', 'feeding', 'fighting', 'flipping', 'hanging', 'hiding', 'hugging', 'juggling', 'kissing',
						'licking', 'painting', 'piloting', 'pushing', 'repairing', 'rubbing', 'scratching', 'shooting', 'smelling', 'swinging','throwing',
						'tickling', 'tying', 'washing', 'wrapping', 'zooming'];

	var object_list = ['dome','hammer','heel','hen','igloo','leaf', 'lock', 'moose', 'seal'];

	var gamelist = [];
	for (var i = 0; i < 10; i++) {
		var person = person_list[Math.floor(Math.random() * person_list.length)];

	while (gamepersonlist.indexOf(person) != -1) {
		var person = person_list[Math.floor(Math.random() * person_list.length)];
	}
	gamepersonlist.push(person);
	var action = action_list[Math.floor(Math.random() * action_list.length)];
	var object = object_list[Math.floor(Math.random() * object_list.length)];
	gamelist.push([person, action, object]);
	};

	return gamelist;
}
function startChecking() {
	var curPerson = gamepersonlist[storyIndex];
	var html = "<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /><div data-role='fieldcontain'><form action='#'><div><input type='text' name='password' id='game-password' value='' placeholder='doing what'/></div><button type='submit' name='submit; value='submit' onclick='generateNextCheck()' >Check and Next</button></form></div></div>";
	$('#gamestories').html(String.format(html, curPerson, curPerson));

}
var gameScore = 0;

function generateNextCheck() {
	event.preventDefault();
	var password = $('#gamestories').find('#game-password').val();
	var newpassword = password.toLowerCase();
	var action = gamelist[storyIndex][1];
	var object = gamelist[storyIndex][2];
	if ((newpassword.indexOf(action)!= -1) && (newpassword.indexOf(object) != -1)){
		alert('correct!');
		gameScore += 1;
	} else {
		alert('wrong!');
	}
	if (storyIndex == 9) {
		$('#gamestories').html('<p>Final Score: ' + gameScore.toString() + "/10 </p><a href='#' onclick='startGame()'> Try Again</a>");

	} else {
		$('#gamestories').find('#game-password').val('');
		storyIndex += 1;
		var curPerson = gamepersonlist[storyIndex];
		var html = "<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /><div data-role='fieldcontain'><form action='#'><div><input type='text' name='password' id='game-password' value='' placeholder='doing what'/></div><button type='submit' name='submit; value='submit' onclick='generateNextCheck()' >Check and Next</button></form></div></div>";
		$('#gamestories').html(String.format(html, curPerson, curPerson));
	}
	$.mobile.changePage("#gamepage");

}
function generateNextSequence(number) {
	var temp = number;
	while (temp > 0) {
		var html="<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /></div><p>is</p>{2}<div class=actionDiv><img class=clue src=images/action/{3}1.jpg /></div><p>a/an</p> <p>{4}</p><div class=objectDiv><img class=clue src=images/object/{5}1.jpg /></div><a href='#' data-role='button' onclick='generateNextStory();' >Next</a>";
	}
	if (temp == 0) {

	}
}
function generateNextStory() {
	storyIndex += 1;
	var cS = gamelist[storyIndex];
	if (storyIndex == 9) {
		//end of storylist
		var html="<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /></div><p>is</p>{2}<div class=actionDiv><img class=clue src=images/action/{3}1.jpg /></div><p>a/an</p> <p>{4}</p><div class=objectDiv><img class=clue src=images/object/{5}1.jpg /></div> <a href='#' data-role='button' onclick='startChecking();' >Finish</a>";
		storyIndex = 0;
	} else {
		//more to come
		var html="<p>{0}</p><div class=personDiv><img class=clue src=images/person/{1}.jpg /></div><p>is</p>{2}<div class=actionDiv><img class=clue src=images/action/{3}1.jpg /></div><p>a/an</p> <p>{4}</p><div class=objectDiv><img class=clue src=images/object/{5}1.jpg /></div><a href='#' data-role='button' onclick='generateNextStory();' >Next</a>";
	}
	$('#gamestories').html(String.format(html, cS[0], cS[0], cS[1], cS[1], cS[2], cS[2]));
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

	while (sequenceIndex != 9) {
		generateNextSequence(sequenceIndex);
		sequenceIndex += 1;
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
	}
}
function changePerson(person, web) {
	var person_list = ['Angelina_Jolie','Bill_Gates','Einstein','Michelle_Obama','Morgan_Freeman','Mozart', 'Adolf_Hitler', 'Barack_Obama', "Bart_Simpson", 
						"Ben_Affleck", "Beyonce", "Bill_Clinton", "Brad_Pitt","Darth_Vader", "Frodo", "George_W_Bush", "Hillary_Clinton", "Homer_Simpson"];

	var newperson = person_list[Math.floor(Math.random() * person_list.length)];

	while (personList.indexOf(newperson) != -1) {
		newperson = person_list[Math.floor(Math.random() * person_list.length)];
	}
	personList.push(newperson);
	document.getElementById(web+'Person').src = "images/person/" + newperson + '.jpg';
	$('#' + web + 'Name').html(newperson);

}
//end of utility function
function getImages(web, useMyOwn) {
	//how to generate /where to list
	var person_list = ['Angelina_Jolie','Bill_Gates','Einstein','Michelle_Obama','Morgan_Freeman','Mozart', 'Adolf_Hitler', 'Barack_Obama', "Bart_Simpson", 
						"Ben_Affleck", "Beyonce", "Bill_Clinton", "Brad_Pitt","Darth_Vader", "Frodo", "George_W_Bush", "Hillary_Clinton", "Homer_Simpson"];

	var action_list = ['balancing', 'bending', 'biting', 'bouncing', 'building', 'burning' , 'chasing', 'clapping', 'climbing' ,'cooking', 'digging',
						'drinking', 'enlarging', 'exploding', 'feeding', 'fighting', 'flipping', 'hanging', 'hiding', 'hugging', 'juggling', 'kissing',
						'licking', 'painting', 'piloting', 'pushing', 'repairing', 'rubbing', 'scratching', 'shooting', 'smelling', 'swinging','throwing',
						'tickling', 'tying', 'washing', 'wrapping', 'zooming'];

	var object_list = ['dome','hammer','heel','hen','igloo','leaf', 'lock', 'moose', 'seal'];

	var action_num = 3;
	var object_num = 3;


	var person = person_list[Math.floor(Math.random() * person_list.length)];

	while (personList.indexOf(person) != -1) {
		var person = person_list[Math.floor(Math.random() * person_list.length)];
	}
	personList.push(person);
	var action = action_list[Math.floor(Math.random() * action_list.length)];
	var object = object_list[Math.floor(Math.random() * object_list.length)];

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
		var value = $('#friend-email').val();
		$('#friend-email').val('');
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
			var images = getImages(value, useMyOwn);
			var footer = "<div data-role=footer data-id=fool data-position=fixed><div data-role=navbar><ul><li><a href=#home>Home</a></li><li><a href=#friends>Accounts</a></li><li><a href=#confirm>Setting</a></li>";
			var newPage = $("<div data-role='page' data-title='"+value+"' id="+value+"Page><div data-role='header' data-position=fixed><a href=#friends data-icon='back'>Back</a><h1>"+ value + "</h1></div><div data-role='content' class=images>"+images+" </div>"+footer+"</div>");
			var popupPage = $("<div data-role='page' data-trasntion='pop' data-rel='pop' data-title='generate a password for"+value + "' id="+value+"Password ><div data-role='fieldcontain'><form action='#' id='passwordChecking'><div><input type='text' name='password' id='typein-password" + value + "' value='' placeholder='Type in your password'/></div><button type='submit' name='submit; value='submit' id='passwordSubmit" + value + "' onclick='checkPassword2(\""  + value + "\")' >Check</button></form></div></div>");
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
	$.mobile.loadPage( '#confirm', { showLoadMsg: false } );
	//$('#confirm').on('#info',function(e,data){
	//console.log(data.prevPage);});
	var emaiList = $('#friendsEmails');
	var sbutton = $('#submit');
	gesture = glist[Math.floor(Math.random()*6)];
	var msg = "<div id='acts'>";
	for (var i = 0; i < gesture.length; i++) {
		if (gesture[i] === 1) msg += 'tap ';
		else msg += "swipe ";
    }
    msg+='<br></div>';
	$('#reportAct').html(msg);
	$('#touchpad').bind('tap', reportEvent);
	$('#touchpad').bind('swipe', reportEvent);
	$('#friendsEmails').submit(submit);
	$('#gen-info').submit(saveForm);
});





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

// Show a custom alert
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