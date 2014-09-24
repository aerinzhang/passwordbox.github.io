var programVariables = programVariables || {};

programVariables.DROPBOX_APP_KEY = '8qw6cevpayp0vyd';
programVariables.client = new Dropbox.Client({key: programVariables.DROPBOX_APP_KEY});

programVariables.accounts = [];
programVariables.stories = [];
programVariables.accountIndex = 0;

programVariables.insertAccount = function (accountName, storyList, index) {
	return true;
	
	//do nothing currently should do the following
	accountTable.insert({
		account:accountName,
		created: new Date(),
		lastRehearsal: new Date(),
		storyList: storyList,
		existingAccountIndex: index
	});
}

programVariables.updateStoryRefCount = function (accountName, accountNestedList) {
 	// fill later
}

programVariables.set = function (propertyKey, value) {
	//eval("programVariables." + propertyKey + " = " + value + ';';
}

programVariables.parseStringToNestedArrays = function (stringOfArray) {
	var result = [];
	for (var i=0; i < stringOfArray.length(); i++) {
		var li = stringOfArray.get(i).split('|||'); 
		result.push(li);
	}
	return result;
}