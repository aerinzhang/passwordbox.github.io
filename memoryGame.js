//This module is for the generic memory game
var memoryGame = memoryGame || {};

PERSON_INDEX = 0;
ACTION_INDEX = 1;
OBJECT_INDEX = 2;
SCENE_INDEX = 3;
//memoryGame.fullGameList is the list with [perosn, action , object, scene]


//TEMP LIST! 
actionList = ['tickling', 'fighting', 'rubbing', 'biting', 'hugging', 'enlarging', 'tying', 'repairing', 'hiding'];
objectList = ['hammer', 'moose', 'snowflake', 'lock', 'igloo', 'leaf', 'dice', 'moon', 'heel'];

memoryGame.generateFullGameList = function(partialGameList) {
	//partialGameList contains gamePplList and gameScenesList
	//TEMP: for now generate randomly
	console.log(partialGameList);
	var result = [];
	for (var i=0; i<memoryGame.gameLength; i++) {
		var person = partialGameList[i][PERSON_INDEX];
		var scene = partialGameList[i][SCENE_INDEX];
		var action = actionList[i];
		var object = objectList[i];
		result.push([person, action, object, scene]);
	}
	return result;
}

//prepare the fullGameList and start next sequence
memoryGame.startGame = function(gameList) {
	memoryGame.storyIndex = 0;
	memoryGame.checkIndex = 0;
	memoryGame.gameScore = 0;
	memoryGame.sequenceIndex = 0;
	memoryGame.progress = 0;

	//either the specified length or default 10
	memoryGame.numStories = gameList.length || 10;
	memoryGame.gameLength = memoryGame.numStories;

	totalStories = 23;
	gamelist=[];

	if (gameList) {
		//if gameList is given then use the given person/scene lists but generate actions/objects lists
		//memoryGame.gamePeopleList = gameList[0]; //0th people list ; 1st scenes list
		//generate action/object list
		gamelist = memoryGame.generateFullGameList(gameList);
		memoryGame.fullGameList = gamelist;
		memoryGame.storyMode43 = true;

	} else {
		//freelance mode need to check we have enough ppl to play the game

		if (existingPersonList.length() > (totalStories-numStories)) {
			//do not have 10 new ppl to put in the list
			alert("Not Enough to Generate 10 new stories");
			return;
		} else{
			var temp = $('#randomnessTextBox').val();
			gamelist = Sha256.generate(temp, 10);
			memoryGame.gamePeopleList = stripPersonFromList(gamelist);
			memoryGame.fullGameList = gamelist;
			console.log(gamelist);
		}

	}
	//temp
	console.log(memoryGame.fullGameList);
	memoryGame.generateNextSequence();
}

memoryGame.displayCheckPage = function(person, scene) {
	var html = "<figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
						<figure><img class=clue src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure>\
						<span data-role='fieldcontain'><form action='#'><span class='boxWidget'>\
						<input type='text' autocorrect='off' name='password' id='game-password' value='' \
						placeholder='doing what' autofocus='autofocus' tabindex='1'/>\
						<input type='text' autocorrect='off' name='password2' id='game-password-b' value=''\
						placeholder='doing what' tabindex='2'/></span>\
						<br><br><div class=halfbuttonDiv><a data-role='button' id='gameCheckNextButton' \
						type='submit' class=right name='submit' value='submit' onclick='memoryGame.generateNextSequence()'\
						tabindex='3'>Check and Next</a>\
						<a href='#' class=left data-role='button' tabindex='4' onclick='memoryGame.forgetStory()'>I Forget</a>\
						</div></span></form></span>";
		$('#gamestories').html(String.format(html, person, person.split('_').join(' '), scene.toLowerCase(), scene.split('_').join(' ')));
		
		//should be in VIEW MODULE LATER!! 
		getVerbComboBox('game-password');
		getObjectComboBox('game-password-b');
}

memoryGame.generateNextSequence = function () {
	event.preventDefault();

	//generate next story
	if (memoryGame.storyIndex <= memoryGame.sequenceIndex) {
		if (memoryGame.storyIndex == 0) {
			var html = "<div class=clueDiv><figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
					 is <figure><img class=clue src=images/action/{2}1.jpg /><figcaption>{3}</figcaption></figure>\
					 {8}<figure><img class=clue src=images/object/{4}1.jpg /><figcaption>{5}</figcaption></figure> \
					 in/on<figure><img class=clue src=images/scene/{6}.jpg /><figcaption>the {7}</figcaption></figure></div>\
					 <div><a href='#' tabindex='1' data-role='button' onclick='memoryGame.generateNextSequence();' >Next</a></div>";
			var story = memoryGame.fullGameList[memoryGame.storyIndex];
			var article = (story[OBJECT_INDEX] == 'igloo') ? 'an' : 'a';
			$('#gamestories').html(String.format(html, story[PERSON_INDEX], story[PERSON_INDEX].split('_').join(' '),
												 story[ACTION_INDEX], story[ACTION_INDEX], story[OBJECT_INDEX], story[OBJECT_INDEX],
												 story[SCENE_INDEX].toLowerCase(), story[SCENE_INDEX], article));
			$.mobile.changePage("#gamepage");
			memoryGame.storyIndex += 1;
		} else {
			memoryGame.generateNextStory();
		}
		$( "#gamepage" ).page( "destroy" ).page();

	//generate next check
	} else if ((memoryGame.storyIndex > memoryGame.sequenceIndex) && 
			   (memoryGame.checkIndex <= memoryGame.sequenceIndex)) {

		//first check in the game
		if (memoryGame.checkIndex == -1) {
			var checkPerson = memoryGame.fullGameList[memoryGame.sequenceIndex][PERSON_INDEX];
			var checkScene = memoryGame.fullGameList[memoryGame.sequenceIndex][SCENE_INDEX];
			memoryGame.displayCheckPage(checkPerson, checkScene);
			memoryGame.checkIndex += 1;
			memoryGame.gameScore = 0; //initial Score is -1?

			//old combo box place holder
			$( "#gamepage" ).page( "destroy" ).page();
			$("#gameCheckNextButton").keypress(function(e) {
				//13 IS ENTER?	
				if (e.keyCode == 13) {
					memoryGame.generateNextSequence();
				}
			});
			$('.boxWidget div').removeClass()
			$('#game-password').focus();
		} else if ((memoryGame.checkIndex == 0) && (memoryGame.sequenceIndex == 0)) {

			var checkPerson = memoryGame.fullGameList[0][PERSON_INDEX];
			var checkScene = memoryGame.fullGameList[0][SCENE_INDEX];

			memoryGame.displayCheckPage(checkPerson, checkScene);
			memoryGame.checkIndex += 1;
			$( "#gamepage" ).page( "destroy" ).page();

			$("#gameCheckNextButton").keypress(function(e) {
				if (e.keyCode == 13) {
					memoryGame.generateNextSequence();
				}
			});
			$('.boxWidget div').removeClass();
			$("#game-password").focus();
		} else {
			memoryGame.generateNextCheck();
		}
	} else {
		if (memoryGame.checkIndex == memoryGame.numStories) {
			memoryGame.generateNextCheck();
		} else if (memoryGame.checkIndex > memoryGame.sequenceIndex) {
			memoryGame.sequenceIndex += 1;
			event.preventDefault();
			$('#game-password').focus();
			var action = memoryGame.fullGameList[memoryGame.checkIndex-1][ACTION_INDEX];
			var object = memoryGame.fullGameList[memoryGame.checkIndex-1][OBJECT_INDEX];
			var password = $('#gamestories').find('#game-password').val().toLowerCase();
			var password_b = $('#gamestories').find('#game-password-b').val().toLowerCase();
			if (memoryGame.getStoryRightCheck(password, password_b, action, object)) {
				memoryGame.checkIndex = -1;
				memoryGame.generateNextSequence();
			} else {
				memoryGame.sequenceIndex -= 1;
				memoryGame.getStoryWrongCheck();
			}
			$( "#gamepage" ).page( "destroy" ).page();
		}
	}
}

memoryGame.getStoryWrongCheck = function () {
	document.getElementById("checkMark").src = 'images/wrong.png';
	$("#checkMark").css('display', 'inline');
	$('#gamestories').css('visibility', 'hidden');
	setTimeout(function() { $("#checkMark").css('display', 'none'); 
							$("#gamestories").css('visibility', 'visible');
							document.getElementById("checkMark").src = 'images/check.png';
						  }, 1000 );
}

memoryGame.getStoryRightCheck = function (inputAction, inputObject, rightAction, rightObject) {	
	if ((inputAction.indexOf(rightAction)!= -1) && (inputObject.indexOf(rightObject) != -1)){
		console.log('correct!');
		memoryGame.progress += 1;
		$("#checkMark").css('display', 'inline');
		$('#gamestories').css('visibility', 'hidden');
		setTimeout(function() { $("#checkMark").css('display', 'none'); 
								$("#gamestories").css('visibility', 'visible')}, 1000 );
		var total = 0;
		for (var i=0; i<memoryGame.numStories ; i++) {
			if (i==0) total += 1;
			else {
				total += (i+2);
			}
		}
		var p = memoryGame.progress/total*1.0;
		$('#progress-bar').val(p.toString());
		p = Math.round(p*100);
		$('#progress-val').html( ' ' + p.toString() + '%');
		memoryGame.gameScore += 1;
		return true;
	}
	return false;
}

memoryGame.generateNextStory = function () {
	var story = memoryGame.fullGameList[memoryGame.storyIndex];
	var html = "<div><figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
			 is<figure><img class=clue src=images/action/{2}1.jpg /><figcaption>{3}</figcaption></figure>\
			 {8}<figure><img class=clue src=images/object/{4}1.jpg /><figcaption>{5}</figcaption></figure>\
			 in/on<figure><img class=clue src=images/scene/{6}.jpg /><figcaption>the {7}</figcaption></figure>\
			 </div><div><a href='#' data-role='button' tabindex='1' onclick='memoryGame.generateNextSequence();' >Next</a></div>";
	var article = (story[OBJECT_INDEX] == 'igloo' ? 'an' : 'a');
	$('#gamestories').html(String.format(html, story[PERSON_INDEX], story[PERSON_INDEX].split('_').join(' '),
											   story[ACTION_INDEX], story[ACTION_INDEX], story[OBJECT_INDEX], story[OBJECT_INDEX], 
											   story[SCENE_INDEX].toLowerCase(), story[SCENE_INDEX].split('_').join(' '), article));
	memoryGame.storyIndex += 1;
	//$.mobile.changePage("#gamepage");
}

memoryGame.finishGame = function () {
	console.log('game finished!');
	$.mobile.changePage("#bank");

}

memoryGame.generateNextCheck = function () {
	event.preventDefault();
	var password = $('#gamestories').find('#game-password').val();
	var password_b = $('#gamestories').find('#game-password-b').val();
	var newpassword = password.toLowerCase();
	var newpassword_b = password_b.toLowerCase();

	if (memoryGame.checkIndex == 0) {
		var action = memoryGame.fullGameList[memoryGame.sequenceIndex][ACTION_INDEX];
		var object = memoryGame.fullGameList[memoryGame.sequenceIndex][OBJECT_INDEX];
	} else {
		var action = memoryGame.fullGameList[memoryGame.checkIndex-1][ACTION_INDEX];
		var object = memoryGame.fullGameList[memoryGame.checkIndex-1][OBJECT_INDEX];
	}
	if (memoryGame.getStoryRightCheck(newpassword, newpassword_b, action, object)) {
		//Last Check ???? FIX LOTS OF STUFF
		if (memoryGame.checkIndex == 1) {//memoryGame.numStories) {
			if (memoryGame.storyMode43) {
				var buttons = "<p><button onclick='memoryGame.sameGameStart()'>Play Again</button></p>\
							   <p><button onclick='memoryGame.finishGame()'>I Got All!</button></p>";
			} else {
				var buttons = "<p><a data-role='button' href='#' onclick='addSomeStories()'> Add Some</a></p>\
							   <p><a data-role='button' href='#' onclick='addStories()'> Add All</a></p>\
							   <p><a data-role='button' href='#' onclick='memoryGame.startGame()'> Try Again</a></p>";
			}
			$('#gamestories').html("<p>Final Score: " + memoryGame.gameScore.toString() + "/"
													  + memoryGame.numStories.toString() + " </p>" + buttons);
		} else {
			$('#gamestories').find('#game-password').val('');
			var curPerson = memoryGame.fullGameList[memoryGame.checkIndex][PERSON_INDEX];
			var curScene = memoryGame.fullGameList[memoryGame.checkIndex][SCENE_INDEX];
			memoryGame.displayCheckPage(curPerson, curScene);
			memoryGame.checkIndex += 1;

			//condense thses as well?
			$( "#gamepage" ).page( "destroy" ).page();
			$("#gameCheckNextButton").keypress(function(e) {
				if (e.keyCode == 13) {
					memoryGame.generateNextSequence();
				}
			});
			$('.boxWidget div').removeClass()
			$('#game-password').focus();
		}
	}  else {
		//got story wrong
		//memoryGame.sequenceIndex -= 1;

		memoryGame.getStoryWrongCheck();
	}
}


//return to Game page from 
memoryGame.backtoGame = function() {
	$.mobile.changePage('#gamepage');
	
	setTimeout(memoryGame.doNothing, 1000);
	$('#game-password').focus();
}

memoryGame.doNothing = function() {
}

//dynamically generate and change to the forget story page
memoryGame.forgetStory = function() {
	var html="<div class=clueDiv><figure><img class=clue src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
			 is <figure><img class=clue src=images/action/{2}1.jpg /><figcaption>{3}</figcaption></figure>\
			 {8}<figure><img class=clue src=images/object/{4}1.jpg /><figcaption>{5}</figcaption></figure>\
			 in/on<figure><img class=clue src=images/scene/{6}.jpg /><figcaption>the {7}</figcaption></figure></div>";
	if (memoryGame.checkIndex == 0) {
		var currentStory = memoryGame.fullGameList[memoryGame.sequenceIndex];
	} else {
		var currentStory = memoryGame.fullGameList[memoryGame.checkIndex-1];
	}
	if (currentStory[OBJECT_INDEX] == 'igloo') {
		var article = 'an';
	} else {
		var article = 'a'
	}
	$('#hintSpace').html(String.format(html, currentStory[PERSON_INDEX], currentStory[PERSON_INDEX].split('_').join(' '), 
											 currentStory[ACTION_INDEX], currentStory[ACTION_INDEX], 
											 currentStory[OBJECT_INDEX], currentStory[OBJECT_INDEX], 
											 currentStory[SCENE_INDEX].toLowerCase(), currentStory[SCENE_INDEX].split('_').join(' '), article));
	$.mobile.changePage("#forgetPage");
}




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
