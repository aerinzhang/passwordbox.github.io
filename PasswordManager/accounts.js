$(document).ready(function(){

	function parseStringToNestedArrays(arrayOfString) {
		var result = [];
		for (var i=0; i < arrayOfString.length(); i++) {
			var li = arrayOfString.get(i).split('|||'); 
			result.push(li);
		}
		return result;
	}

	var currentURL = chrome.extension.getBackgroundPage().currentTab;
	var accountTable = chrome.extension.getBackgroundPage().accountTable;
	var storyBankTable = chrome.extension.getBackgroundPage().storyBankTable;
	var records = accountTable.query();
	var stories = storyBankTable.query();
	//if there are stories in the bank
	if (stories.length > 0) {
		//create each page for each account
		for (var i=0; i < records.length; i++) {
			var accountIndex = i;
			var record = records[i];
			var temp = record.get('storyList');
			var list = parseStringToNestedArrays(record.get('storyList'));
			var web = record.get('account');
			var accountIndexForChecking = record.get('existingAccountIndex');
			var time = record.get('lastRehearsal').toString();
			

			var keyid = 'button' + accountIndex;
			var estring = 'list'+accountIndex;
			var jbuttonid = '#' + keyid;
			var listid = '#' +estring;
			$("#list").append("<li id="+web+ "><a href=#"+web+"Page id="+keyid+" data-wrapperels='span' data-inline='true' data-icon='delete' data-iconpos='right' data-theme='a'>" + web + "</a></li>");
			if ($('#list').hasClass('ui-listview')) {
				$('#list').listview('refresh');
			} else {
				$('#list').trigger('create');
			}
			$('#list').listview('refresh');
		}
	} else {
		//alert('play the game!');
	}

});