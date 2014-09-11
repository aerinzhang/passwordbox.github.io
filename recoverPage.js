//Each story inside the storybank has a button to recovery that story if needed
//Each story belongs to a group with certain index 

var recoveryMechanism = recoveryMechanism ||{};

//temp ! where to put reslut?

//for 43 story only 
recoveryMechanism.fiveGroupHashes = [null, null, null, null, null];

var temp = [['Bill_Clinton', 'court'],['Darth_Vader', 'restaurant'],['Frodo', 'baseball_field'],
						['Adolf_Hitler', 'pool_bar'],['Marilyn_Monroe', 'fancy_house'], ['Bart_Simpson', 'mountain']];
//This function dynamically generate the recovery input page to gather
//stories that user do remember
recoveryMechanism.generateRecoveryInputPageForGroup = function (listStories){
	//first retrive all stories with given index and put them in a list
	//listStories = temp;
	var head = '<ul data-role="listview" data-inset="true">';
	for (var i=0; i<listStories.length; i++){
		var tuple = listStories[i];
		var person = tuple[0];
		var scene = tuple[1];		
		var listElement = "<li class='boarditems'><span class='pairdiv'><figure>\
							<img class=pair src='images/person/" + person + ".jpg' />\
							<figcaption><p class='storyText'>" + person.replace('_', ' ') + "</p>\
							</figcaption></figure><figure><img class=pair src='images/scene/" + scene + ".jpg' /><figcaption>\
							<p class='storyText'>" + scene.replace('_', ' ') + "</p></figcaption></figure></span>\
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

//this function returns 1 if resulthash already exists / meaning correct one found
recoveryMechanism.compareHashToExistongOnes = function(resultHash) {
	for (var i=0; i<allHashes.length; i++) {
		var curHash = allHashes[i];
		if (curHash == resultHash) return true;
	}
	return false;
}

recoveryMechanism.progressFn = function(){
}

recoveryMechanism.callbackFn = function(hash) {
	recoveryMechanism.result = hash;
	console.log(hash);
}

recoveryMechanism.generateBCryptHash = function (inputString) {
	var round = appConstants.NUM_OF_ROUNDS;
	var salt;
	//generate salt using issac
	try {
		salt = recoveryMechanism.bcrypt.gensalt(round);
	} catch (err) {
		alert(err);
		return;
	}
	try {
		recoveryMechanism.bcrypt.hashpw(inputString, salt, recoveryMechanism.callbackFn, recoveryMechanism.progressFn);
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
	var storyList = temp;
	var count = 0;
	var inputFirstHalf = '';
	var inputSecondhalf = '';
	for (var i=0; i<storyList.length; i++) {
		var id = '#game-password'+ i.toString();
		var userInput = $(id).val();
		if ((userInput != '') && (index!=i)) count ++;
		if (i < index) inputFirstHalf += userInput;
		if (i > index) inputSecondhalf += userInput;
	}
	//if there are less than five stories cannot perform the recovery
	//QUESTION: what five should we use?????
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
			recoveryMechanism.generateBCryptHash(string);
			
			//check if this hash exists 
			if (compareHashToExistongOnes(recoveryMechanism.result)) {
				console.log('hash found');
			}
		}
	}

}
recoveryMechanism.computeHashesOfGroup = function(groupFullList) {
	var hashList = [];
	if (groupFullList.length >= 6) {
		var k = 6;
		var allComb = recoveryMechanism.regularComputeCombinations(groupFullList, k);
		for (var i=0; i<allComb.length; i++) {
			var oneString = allComb[i][1].concat(allComb[i][2]);
			//compute hash for one combination
			var oneHash = recoveryMechanism.generateBCryptHash(oneString);
			hashList.push(oneHash);
		}
	}
	return hashList;
}

//bank and rehearse schedule
recoveryMechanism.regularComputeCombinations = function(bank, k) {
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
		var result1 = recoveryMechanism.regularComputeCombinations(bank.slice(1), k-1);
		var result2 = recoveryMechanism.regularComputeCombinations(bank.slice(1), k);
		for (var i = 0; i < result1.length ; i++) {   
			allperm.push([bank[0]].concat(result1[i]));
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