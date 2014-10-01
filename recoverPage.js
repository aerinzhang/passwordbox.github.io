//Each story inside the storybank has a button to recovery that story if needed
//Each story belongs to a group with certain index 

var recoveryMechanism = recoveryMechanism ||{};

//temp ! where to put reslut?

//for 43 story only 
recoveryMechanism.fiveGroupHashes = [null, null, null, null, null];
recoveryMechanism.hashResults = [];

var temp = [['Bill_Clinton', 'court'],['Darth_Vader', 'restaurant'],['Frodo', 'baseball_field'],
						['Adolf_Hitler', 'pool_bar'],['Marilyn_Monroe', 'fancy_house'], ['Bart_Simpson', 'mountain']];
//This function dynamically generate the recovery input page to gather
//stories that user do remember
recoveryMechanism.generateRecoveryInputPageForGroup = function (listStories, groupIndex){
	//first retrive all stories with given index and put them in a list
	//listStories = temp;
	recoveryMechanism.groupIndex = groupIndex;
	recoveryMechanism.recoveryResult = null;

	var head = '<ul data-role="listview" data-inset="true">';
	for (var i=0; i<listStories.length; i++){
		var tuple = listStories[i];
		var person = tuple[0];
		var scene = tuple[1];		
		var listElement = "<li class='boarditems'><span class='pairdiv'><figure>\
							<img class=pair src='images/person/" + person + ".jpg' />\
							<figcaption><p class='storyText'>" + person.split('_').join(' ') + "</p>\
							</figcaption></figure><figure><img class=pair src='images/scene/" + scene.toLowerCase() + ".jpg' /><figcaption>\
							<p class='storyText'>" + scene.split('_').join(' ') + "</p></figcaption></figure></span>\
							<span data-role='fieldcontain'><form action='#'>\
							<span class='boxWidget'><input type='text' autocorrect='off' name='password'\
							id='game-password" + i + "' value='' placeholder='doing what' autofocus='autofocus' tabindex='1'/>\
							</span></form></span></li>"
		head += listElement;
	}
	head += '</ul>';
	$('#groupStories').html(head);
	return;
}


//this function returns true if resulthash already exists / meaning correct one found
recoveryMechanism.compareHashToExistongOnes = function(resultHash) {
	var allHashes = storyMode.makeHashStringIntoList(
					storyMode.groupHashesList[recoveryMechanism.groupIndex]);
	//need to unflatten this string into a list
	for (var i=0; i<allHashes.length; i++) {
		var curHash = allHashes[i];
		if (curHash == resultHash) return true;
	}
	return false;
}

recoveryMechanism.progressFn = function(){
}

recoveryMechanism.callbackFnForGeneratingGroupHashes = function(hash) {
	recoveryMechanism.hashResults.push(hash);
}

recoveryMechanism.callbackFnForRecovery = function(hash, pwGuess) {
	if (recoveryMechanism.compareHashToExistongOnes(hash)) {
		//found the result: store the action & object
		recoveryMechanism.recoveryResult = pwGuess;
		console.log('found! ' + pwGuess);
	}

}

recoveryMechanism.generateBCryptHash = function (inputString, callbackFunction, passwordGuess) {
	var round = appConstants.NUM_OF_ROUNDS;
	var salt;
	var hash;
	//generate salt using issac
	try {
		salt = recoveryMechanism.bcrypt.gensalt(round);
	} catch (err) {
		alert(err);
		return;
	}
	try {
		recoveryMechanism.bcrypt.hashpw(inputString, salt, callbackFunction, recoveryMechanism.progressFn, passwordGuess);

	} catch(err) {
		alert(err);
		return;
	}

}
//recoveryMechanism.
//this function 
recoveryMechanism.gatherUserInput = function (index){
	//the index parameter is the position of the missing story in this given group

	//get the length of the list
	var length = storyMode.groupList[recoveryMechanism.groupIndex];
	var count = 0;
	var inputFirstHalf = '';
	var inputSecondhalf = '';
	for (var i=0; i<length; i++) {
		var id = '#game-password'+ i.toString();
		var userInput = $(id).val();
		console.log('logging userInput for index ' + i.toString());
		console.log(userInput);
		if ((userInput != '') && (index!=i)) count ++;
		if (i < index) inputFirstHalf += userInput;
		if (i > index) inputSecondhalf += userInput;
	}
	console.log('logging firsthalf');
	console.log(inputFirstHalf);
	console.log('logging second half');
	console.log(inputSecondhalf);
	//if there are less than five stories cannot perform the recovery
	//QUESTION: what five should we use????? CURRENTLY FIRST 5 STORIES LATER  
	if (count < 5) {
		alert('cannot recover missing story without five known stories');
		return;
	}
	//loop through all possible actions and objects 
	for (var i=0; i<appConstants.actionsList.length; i++) {
		for (var j=0; j<appConstants.objectsList.length; j++) {
			var action = appConstants.actionsList[i];
			var object = appConstants.objectsList[j];
			var string = inputFirstHalf + action + object + inputSecondhalf;
			var password = action + object;
			recoveryMechanism.generateBCryptHash(string,
				// no way to short cut since it is a callback fn
				recoveryMechanism.callbackFnForRecovery, password);
		}
	}

}
recoveryMechanism.computeHashesOfGroup = function(groupFullList) {
	var hashList = [];
	var hash;
	if (groupFullList.length >= 6) {
		var k = 6;
		var allComb = recoveryMechanism.regularComputeCombinations(groupFullList, k);
		for (var i=0; i<allComb.length; i++) {
			//one set of six
			var oneSet = allComb[i];
			var oneString = '';
			for (var j=0; j<oneSet.length; j++) {
				oneString = oneString + oneSet[j][1] + oneSet[j][2];
			}
			//compute hash for one set of six stories
			recoveryMechanism.generateBCryptHash(oneString, 
				recoveryMechanism.callbackFnForGeneratingGroupHashes);

		}
	}
	return;
}

//bank and rehearse schedule
recoveryMechanism.regularComputeCombinations = function(bank, k) {
	if (bank.length < k) {
		return [[]]
	} else if (bank.length === k) {
		return [bank]
	} else if (k === 1) {
		var newB = [];
		for (var i=0; i < bank.length; i++) {
			newB.push([bank[i]]);
		}
		return newB;

	} else {
		var allperm = []
		var result1 = recoveryMechanism.regularComputeCombinations(bank.slice(1), k-1);
		var result2 = recoveryMechanism.regularComputeCombinations(bank.slice(1), k);
		for (var i = 0; i < result1.length ; i++) {
			var temp = [bank[0]];
			temp.push.apply(temp, result1[i]);
			allperm.push(temp);
		}
		for (var j =0; j < result2.length; j ++) {
			allperm.push(result2[j]);
		}
		return allperm;
	}
}

$( document ).ready(function(){
	recoveryMechanism.bcrypt = new bCrypt();
	//recoveryMechanism.generateRecoveryInputPageForGroup(1);
})