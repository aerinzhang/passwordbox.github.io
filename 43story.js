//This module is for the 43 story mode
var storyMode43 = storyMode43 || {};

storyMode43.CHAR_LIMIT = 30;
storyMode43.UNIQUE_CHAR_LIMIT = 20;


//TEMP!
var records = [];
String.format = function() {
	var s = arguments[0];
	for (var i = 0; i < arguments.length - 1; i++) {       
		var reg = new RegExp("\\{" + i + "\\}", "gm");             
		s = s.replace(reg, arguments[i + 1]);
	}
	return s;
}

storyMode43.generateStoryGroup = function(index) {
	//hard-coded groups for 43 stories 9-8-8-8-9
	var limitsList = [8, 16, 25, 33, 42];
	for ( var i=0; i<limitsList.length; i++ ) {
		var curLimit = limitsList[i];
		if (index <= curLimit) {
			//falls in the group sets all stories in the same group to be true
			if (i == 0) {
				//first group
				var startFrom = 0;
			} else {
				var startFrom = limitsList[i-1]+1;
			}
			for (var j=startFrom; j<=curLimit; j++) {
				records[j][2] = true;
			}
			//$("#bank").page('destroy').page();  
			console.log('play Game!');
			var group = records.slice(startFrom, curLimit+1)
			//storeHashesforThisGroup
			recoveryMechanism.fiveGroupHashes[i] = recoveryMechanism.computeHashesOfGroup(group);
			memoryGame.startGame(group);
			//playtheGame

			return;
		}
	}
}

storyMode43.recoverStory = function (index) {
	console.log(index);
	var limitsList = [8, 16, 25, 33, 42];
	var startIndex = 0;
	for ( var i=0; i<limitsList.length; i++) {
		if (index <= limitsList[i]) {
			var group = records.slice(startIndex, limitsList[i]+1);
			console.log(group);
			recoveryMechanism.generateRecoveryInputPageForGroup(group);
			$.mobile.changePage('#recover');
			return;
		} else {
			//not there yetl
			startIndex = limitsList[i];
		}
	}
}

//might be for rendering Module
function renderStoryBank() {
	$('#bank').bind("pageshow", function() {

		//var records = storyBankTable.query();
		if (records.length > 0) {
			var listHTML = '<div id="bankStories"><ul data-role="listview" data-inset="true">'
			for (var i =0; i < records.length; i++ ){
				var record = records[i];
				//console.log(record);
				//console.log(records.length);

				//var score = Math.round(calculateScoreForStory(record));
				var score = 0;

				//var li = '<li><a href="#" ><img src="images/person/{0}.jpg"><p>{1}</p></a></li>'
				/*var pair = "<li><span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption><span class='storyText'>{1}</span></figcaption></figure> \
						 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption><span class='storyText'>{3}</span></figcaption></figure></span><span class='storyText'>{4}</span><span class='storyText'>Score : {5}</span></li>";
				var newli = String.format(pair, record.get('person'), record.get('person').replace('_', ' '), record.get('scene').toLowerCase(),
					record.get('scene').replace('_', ' '), record.get('lastRehearsed').toString(), score.toString());*/			
				//var date = extractDate(record.get('lastRehearsed'));
				var date = 'Date Created';
				var person = record[0];
				var scene = record[1];
				var used = record[2];
				console.log(used);
				if (used) {
					var className = "initializedStory";
					var button = "<p style='margin:0px; margin-top:2%'><button onclick='storyMode43.recoverStory(" + i + ")' \
								 style='text-align:center;font-family=Lato;'>Recover This Story</button></p>";
					var pair = "<li class='"  + className + "'><span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption><p class='storyText'>{1}</p><p class='dateText'>{4}</p></figcaption></figure> \
						 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption><p class='storyText'>{3}</p><p class='scoreText'>Score:{5}</p></figcaption></figure></span>"
						 	+ button + "</li>";
					var newli = String.format(pair, person, person.replace('_', ' '), scene.toLowerCase(),
								scene.replace('_', ' '), date, score.toString());
				} else {
					var className = "unInitializedStory";
					var button = "<p style='margin:0px; margin-top:2%'><button onclick='storyMode43.generateStoryGroup(" + i + ")' \
								 style='text-align:center;font-family=Lato;'>Add This Story</button></p>";
					var pair = "<li class='"  + className + "'><span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption><p class='storyText'>{1}</p><p class='dateText'></p></figcaption></figure> \
						 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption><p class='storyText'>{3}</p><p class='scoreText'></p></figcaption></figure></span>" + button + "</li>";
					var newli = String.format(pair, person, person.replace('_', ' '), scene.toLowerCase(),
								scene.replace('_', ' '));
				}
				//var perosn = record.get('person');
				//var scene = record.get('scene') ;

	    		listHTML += newli;
	    	}
	    	listHTML += "</ul></div>";
	   		$('#banklist').html(listHTML);
	   		$("#bankStories").listview().listview("refresh");
	   		//missing?
		}
	});

}

storyMode43.populateBank = function(){
	var copyPeopleList = appConstants.peopleList.slice(0);
	var copyScenesList = appConstants.scenesList.slice(0);
	var usedPersonList = [];
	var usedSceneList = [];
	var finalPersonList = [];
	var finalSceneList = [];
	var finalRecords = [];

	var NUMBER_OF_STORIES = 43;
	var temp = $('#randomnessTextBoxStoryMode').val();
	//should use sha256 but needs to be modified.  currently uses random 
	//var storyBankList = Sha256.generate(temp, 43);

	for (var i=0; i<NUMBER_OF_STORIES; i++) {
		var personIndex = Math.floor(Math.random() * copyPeopleList.length);
		var sceneIndex = Math.floor(Math.random() * copyScenesList.length);

		var person = copyPeopleList[personIndex];
		var scene = copyScenesList[sceneIndex];
		var used = false;
		var tuple = [person, scene, used];
		finalPersonList.push(person);
		finalSceneList.push(scene);
		finalRecords.push(tuple);
		records.push(tuple);
		copyPeopleList.splice(personIndex, 1);
		copyScenesList.splice(sceneIndex, 1);
	}
	//records = finalRecords;
	//display the storyBank 
	renderStoryBank();
	$.mobile.changePage('#bank');

}

//helper for key up
storyMode43.calculateUniqueChar = function (txt) {
	var uniqueCharList = [];
	for (var i=0; i<txt.length; i++) {
		var aChar = txt.charAt(i);
		if (uniqueCharList.indexOf(aChar) == -1) {
			uniqueCharList.push(aChar);
		}
	}
	return uniqueCharList.length;
}
//key up function 
storyMode43.limits = function (obj, suffix) {
	var limit = storyMode43.CHAR_LIMIT;
	var uniqueLimit = storyMode43.UNIQUE_CHAR_LIMIT;
	var counter = $('#charCounter'.concat(suffix));
	var uniqueCounter = $('#uniqueCharCounter'.concat(suffix));
	var txt = obj.val();
	var length = txt.length;
	var uniqueLength = storyMode43.calculateUniqueChar(txt);
	//if length not enough
	if (!(length >= limit && uniqueLength >= uniqueLimit)) {
		counter.html(length);
		uniqueCounter.html(uniqueLength);
	} else {
		//enalbe button
		//TO DO fix button 
		document.getElementById('submitRandom'.concat(suffix)).disabled = false;
		counter.html(length);
		uniqueCounter.html(uniqueLength);
	}
}

$(document).ready(function(){
	$('#randomnessTextBoxStoryMode').keyup(function() {
		storyMode43.limits($(this), 'StoryMode');
    });
});
