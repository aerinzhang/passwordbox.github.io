var programVariables = programVariables || {};

programVariables.DROPBOX_APP_KEY = '8qw6cevpayp0vyd';
programVariables.client = new Dropbox.Client({key: programVariables.DROPBOX_APP_KEY});
programVariables.datastore = null;

programVariables.storyBank = [];
programVariables.accounts = [];
programVariables.stories = [];
programVariables.accountIndex = 0;


programVariables.initialize = function (){
	programVariables.client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
		if (error) {
			alert('Error opening default datastore: ' + error);
		} 
		programVariables.datastore = datastore;
		programVariables.storyBankTable = datastore.getTable('stories');
		programVariables.accountTable = datastore.getTable('accounts');
		programVariables.generalTable = datastore.getTable('general');

		programVariables.storyBank = programVariables.stripStoryFromRecords();
		programVariables.programRecord = programVariables.generalTable.query();
		if (programVariables.programRecord.length == 0) {
			//initialize values
			programVariables.insertProgramRecord(programVariables.generalTable);
		} else if (programVariables.programRecord.length == 1) {
			programVariables.programRecord = programVariables.programRecord[0];
			var tempRecord = programVariables.programRecord;
			//load stored values
			programVariables.accountIndex = tempRecord.get('accountIndex');
			programVariables.existingAccountIndex = tempRecord.get('existingAccountIndex');
			programVariables.existingAccounts = tempRecord.get('existingAccounts');
			programVariables.existingPersonList = tempRecord.get('existingPersonList');
			programVariables.existingSceneList = tempRecord.get('existingSceneList');
		} else {
			//should never get here since generalTable should only have one entry
			alert('something is wrong please contact our developer');
		}
 		// Populate Initial Bank & Account List
 		storyMode.updateStoryBankList();
 		accountPage.updateAccountList();

 		//Ensure future changes update the list 
 		programVariables.datastore.recordsChanged.addListener(updateStoryBankList);
		programVariables.datastore.recordsChanged.addListener(updateAccountList);	
		alert('the end of initialization');
		//UI Change after logging in REFER TO pm.js
	});
}

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

programVariables.insertProgramRecord = function (generalTable) {
	generalTable.insert({
		accountIndex : 0,
		existingAccountIndex : 0,
		existingAccounts : [],
		existingSceneList : [],
		existingPersonList : [] 
	});
}

programVariables.updateStoryRefCount = function (accountName, accountNestedList) {
 	// fill later
}

programVariables.set = function (propertyKey, value) {
	//eval("programVariables." + propertyKey + " = " + value + ';';
}

programVariables.stripStoryFromRecords = function() {
	var records = programVariables.storyBankTable.query();
	var storyList = [];
	for (var i = 0; i < records.length; i++ ){
		var record = records[i];
		storyList.push([record.get('person'), record.get('scene')]);
	}
	return storyList;
}

programVariables.parseStringToNestedArrays = function (stringOfArray) {
	var result = [];
	for (var i=0; i < stringOfArray.length(); i++) {
		var li = stringOfArray.get(i).split('|||'); 
		result.push(li);
	}
	return result;
}