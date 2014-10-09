var recoveryMechanism = (function() {
	var module = {};

	var PERSON_INDEX_PUB = 0;
	var SCENE_INDEX_PUB = 1;
	var ACTION_INDEX_PRI = 1;
	var OBJECT_INDEX_PRI = 2;
	var MINIMUM_STORY_COUNT = 5;
	var NUM_OF_ROUNDS = 5;

	var hashResults = [];
	var recoveryResult = null;
	var groupIndex;
	var missingStoryIndex;

	//recursively compute (bank.size choose k)
	function computeCombinationsOfSizeK (bank, k) {
		if (bank.length < k) {
			return [[]];
		} else if (bank.length === k) {
			return [bank];
		} else if (k === 1) {
			return bank.map( function (e) {return [e];} );
		} else {
			var result = [];
			var withFirst = computeCombinationsOfSizeK(bank.slice(1), k-1);
			var withOutFirst = computeCombinationsOfSizeK(bank.slice(1), k);

			for (var i=0; i<withFirst.length; i++) {
				var first = [bank[0]];
				first.push.apply(first, withFirst[i]);
				result.push(first);
			}
			withOutFirst.map( function (e) {result.push(e);} );
			return result;
		}
	}

	function compareHashToExistingOnes (hashResult) {
		//grab stored hashes from dropBox for given group
		var allHashes = storyMode.makeHashStringIntoList(
					storyMode.groupHashesList[groupIndex]);

		//true if hashResult is found in allHashes; false otherwise
		return (allHashes.indexOf(hashResult) >= 0);
	}

	function callbackFnForGroupHashes (hash, string) {
		hashResults.push(hash);

		//for DEBUGGING NOW
		console.log('the string ' + string + ' is hashed in to ' + hash);
	}

	function callbackFnForRecovery (hash, pwGuess) {
		if (compareHashToExistingOnes(hash)) {
			//if result found, store the action & object
			recoveryResult = pwGuess;
			alert('found!');
			console.log('found');
		}
	}

	function generateBCryptHash (inStr, callbkFn, pwGuess, saltStr) {
		var salt;
		var round = NUM_OF_ROUNDS;
		var localBCrypt = new bCrypt();

		// generate salt using issac 
		try {
			if (saltStr == undefined) {
				salt = localBCrypt.gensalt(round);
			} else {
				salt = saltStr;
			}
		} catch (err) {
			alert('bCrypt gensalt error ' + err);
			return;
		} 

		try {
			//'' is the progressFn which does nothing
			localBCrypt.hashpw(inStr, salt, callbkFn, '', pwGuess);
		} catch (err) {
			alert('bCrypt hashpw error ' + err);
			return;
		}
	}

	function computeHashesOfGroup (groupFullList) {
		var salt;
		var groupStr;
		var round = NUM_OF_ROUNDS;
		var localBCrypt = new bCrypt();

		try {
			salt = localBCrypt.gensalt(round);
		} catch (err) {
			alert('computeHashesOfGroup gensalt error ' + err);
			//?WHAT IF ERROR?
			return;
		}

		//????????
		//should store salt!
		storyMode.groupSaltList[groupIndex] = salt;
		//update record
		var programRecord = programVariables.storyModeGeneralTable.query()[0];
		programRecord.set('groupSaltList', storyMode.groupSaltList);

		//if could use recovery mechanism;
		if (groupFullList.length > MINIMUM_STORY_COUNT) {
			var k = MINIMUM_STORY_COUNT + 1;
			var allCombinations = computeCombinationsOfSizeK(groupFullList, k);
			for (var i=0; i<allCombinations.length; i++) {
				groupStr = ((allCombinations[i]).map( 
						function (l) {
							return l[ACTION_INDEX_PRI] + l[OBJECT_INDEX_PRI];
						})).join('');

				//compute hash for one set of six stories
				generateBCryptHash(groupStr, callbackFnForGroupHashes, 
						groupStr, salt);

			}
		}
		return;
	}

	function gatherUserInput () {
		//index is the position of the missing story in group
		var inputId;
		var userInput;
		var stroyGuess;
		var groupGuess;
		var inputCount = 0;
		var inputFirstHalf = '';
		var inputSecondHalf = '';
		var length = storyMode.groupList[groupIndex];
		var groupSalt = storyMode.groupSaltList[groupIndex];

		for (var i=0; i<length; i++) {
			inputId = '#game-password'+ i.toString();
			userInput = $(inputId).val();
			if ( (userInput != '') && (missingStoryIndex!=i) ) inputCount++;
			if (i < missingStoryIndex) inputFirstHalf += userInput;
			if (i > missingStoryIndex) inputSecondHalf += userInput;
		}

		//less than minimum count cannot perform recovery
		if (inputCount < MINIMUM_STORY_COUNT) {
			//maybe fix this redirect back to recovery page?
			alert('Cannot Recover Missing Story without Five Known Ones!');
			return;
		}

		//loop through all possible actions and objects combined with known ones
		for (var i=0; i<appConstants.actionsList.length; i++) {
			for (var j=0; j<appConstants.objectsList.length; j++) {
				storyGuess = appConstants.actionsList[i] + 
						appConstants.objectsList[j];
				groupGuess = inputFirstHalf + storyGuess + inputSecondHalf;

				//no way to short-circuit since bCrypt uses a callback fn
				generateBCryptHash(groupGuess,
					callbackFnForRecovery, groupGuess, groupSalt);
			}
		}


	}

	function initializePrivateValues () {
		recoveryResult = null;
		hashResults = [];
	}

	//CONTROLLER PUBLIC METHOD
	module.emptyPrivateValues = initializePrivateValues;
	module.computeHashesForGroup = computeHashesOfGroup;
	module.startRecovery = function () {
		gatherUserInput();
	}
	module.getHashResults = function () {
		return hashResults;
	}
	module.generateRecoveryPage = function (group, i, index) {
		displayRecoveryInputPage(group, i, index);
		return;
	}
	//VIEW FUNCTIONS

	//generate the recovery page used to gather user input
	function displayRecoveryInputPage (storyList, gpIndex, storyIndex) {
		var person;
		var scene;
		var story;
		groupIndex = gpIndex;
		missingStoryIndex = storyIndex;

		//initialize private values in case of first-time use;
		initializePrivateValues();

		var head = '<ul data-role="listview" data-inset="true">';
		//??? refer back
		for (var i=0; i<storyList.length; i++){
			story = storyList[i];
			person = story[PERSON_INDEX_PUB];
			scene = story[SCENE_INDEX_PUB];		
			var listHtml = "\
					<li class='boarditems'><span class='pairdiv'><figure>\
					<img class=pair src='images/person/" + person + ".jpg' />\
					<figcaption><p class='storyText'>" + 
					person.split('_').join(' ') + "</p></figcaption></figure>\
					<figure><img class=pair src='images/scene/" + 
					scene.toLowerCase() + ".jpg' /><figcaption>\
					<p class='storyText'>" + scene.split('_').join(' ') + "\
					</p></figcaption></figure></span>\
					<span data-role='fieldcontain'><form action='#'>\
					<span class='boxWidget'><input type='text' \
					autocorrect='off' name='password' \
					id='game-password" + i + "' value='' \
					placeholder='doing what' autofocus='autofocus' \
					tabindex='1'/></span></form></span></li>"
			head += listHtml;
		}
		head += '</ul>';
		$('#groupStories').html(head);
		return;
	}

return module;

})();
