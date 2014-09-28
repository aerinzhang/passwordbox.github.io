//this module is for Putting Accounts
var accountPage = accountPage || {};

//TEMP: load accountIndex = ?
accountPage.accountIndex = 0;
accountPage.updateListBool = true;
accountPage.existingAccountIndex = 0;

PERSON_INDEX = 0;
SCENE_INDEX = 1;

accountPage.isWebsite = function(web) {
	//check empty/ same account entered
	return true;
}



accountPage.submit = function(e) {

	if (((e.keyCode === 13) || (e.keyCode == undefined)) && ($("#entry:focus"))) {
		e.preventDefault();

		//use my own photo? currently disabled
		var useMyOwn = false;
		//var useMyOwn = document.getElementById('checkbox-2').checked;

		var accountID = 'button' + accountPage.accountIndex;
		var account = $('#accountName').val();
		$('#accountName').val('');

		//if pass validation of data
		if (accountPage.isWebsite(account)) {
			var eString = 'list'+ accountPage.accountIndex;
			var buttonID = '#' + accountID;
			var listID = '#' + eString;

			//what is this?
			$('.images').css('text-align','center');

			//generate next story of four & make sure the 4?6?8-story combination is unique
			var level = "setFamily." + storyMode.securityLevel.toLowerCase();
			var args = "(" + accountPage.accountIndex + ")";
			var functionName = level.concat(("SecurityIthAccount" + args));
			var cueList = eval(functionName);



			//Put in Dropbox! Need Another Module!!!! FIX LATER
			programVariables.insertAccount(account, cueList, accountPage.accountIndex);
			//?accountStoryList, existingAccountIndex);
			programVariables.updateStoryRefCount(account, cueList);
			

			//add one to existingAccountIndex
			//existingAccountIndex+=1;
			programVariables.set('existingAccountIndex', accountPage.existingAccountIndex) ;	

			//existingAccounts.push(accountInfo);	


			//should be true false temprorily
			accountPage.renderAccountList(false);

			//currentPageID = value;? USEFUL OR NOT
		}

	} else {
		alert('Warning: Account entered is not valid');
	}
	return false;
}

//Account View Functions
accountPage.renderAccountList = function(changePageBool) {

		//var records = accountTable.query();
		//var stories = storyBankTable.query();
		//where to put those ?

		var accounts = programVariables.accounts;
		var stories = programVariables.stories;
		var accountIndex = programVariables.accountIndex;

		//if there are stories in the bank 
		//NEW CONDITION NEEDED!!!!!! STORIES NEEDED ALREADY UNLOCKED
		if (stories.length >= 0) {
			//create each page for each account
			for (var i=0; i < accounts.length; i++) {
				var account = accounts[i];
				var temp = account.get('storyList');
				var list = programVariables.parseStringToNestedArrays(account.get('storyList'));
				var accountName = account.get('account');
				var accountIndexForChecking = account.get('existingAccountIndex');
				var time = '0PM';
				//var time = record.get('lastRehearsal').toString();
				var pageHtml = accountPage.renderEachAccountElements(time, accountName, 
												list, accountIndexForChecking);

				var newPage = $("<div data-role='page' data-title='" + accountName + 
								"' id=" + accountName + "Page><div data-role='header'\
								data-position=fixed><a href=#accounts \
								data-icon='back'>Back</a><h1>"+ accountName + 
								"</h1></div><div data-role='content' \
								class=images>"+ pageHtml + " </div></div>");
				
				if ( accountPage.updateListBool || 
					(changePageBool && i==accounts.length-1) ) {

					//if insert the first time
					var keyID = 'button' + accountIndex;
					var eString = 'list'+ accountIndex;
					var buttonID = '#' + keyID;
					var listID = '#' + eString;
					$("#list").append( "<li id=" + accountName + "><a href=#" + accountName + 
									   "Page id=" + keyID + " data-wrapperels=\
									   'span' data-inline='true' data-icon=\
									   'delete' data-iconpos='right' data-theme\
									   ='a'>" + accountName + "</a></li>");

					if ($('#list').hasClass('ui-listview')) {
						$('#list').listview('refresh');
					} else {
						$('#list').trigger('create');
					}

					if ( accountPage.updateListBool || 
						(changePageBool && i==records.length-1)) {
						newPage.appendTo( $.mobile.pageContainer );
					}
				}
			}
			//update the account page
		} else {
			//alert('play the game to unlock more stories!');
		}
		if (changePageBool) {
			accountPage.accountIndex += 1;
			//programRecord.set('accountIndex', accountIndex);
			$.mobile.changePage(newPage);
		}
	accountPage.updateListBool = false;
}

accountPage.renderEachAccountElements = function(time, accountName, list, index) {
	//check duplicates?

	//create html for each page
	var html = "<div id='" + accountName + "Stories'>";
	for (var i=0; i < list.length; i ++) {
		if (i % 2 == 0) {
			var liold = "<div class=twoPairs><span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
					 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure></span>";
		}
		else {
			var liold = "       &nbsp&nbsp<span class='pairdiv'><figure><img class=pair src=images/person/{0}.jpg /><figcaption>{1}</figcaption></figure>\
					 	<figure><img class=pair src=images/scene/{2}.jpg /><figcaption>{3}</figcaption></figure></span></div>";
			}
		var li = String.format(liold, list[i][PERSON_INDEX], list[i][PERSON_INDEX].split('_').join(' '),
									  list[i][SCENE_INDEX].toLowerCase(), list[i][SCENE_INDEX].split('_').join(' '));
		html += li;
	}
	html += "</div><br><input type='text' autocorrect='off' name='password' id='"+accountName+"-password' value='' placeholder='Type in your password' autofocus='autofocus'/>\
			<a href=# data-role='button' data-rel='popup' onclick='checkPasswordNew(\""  + accountName + "\", " + index + ")' > Rehearse Account</a>"
	return html;
}

accountPage.updateAccountList = function() {
	var records = programVariables.accountTable.query();

	//should sord by last rehearsal date (CURRENTLY COMMENTED OUT)

	// records.sort(function (accountA, accountB) {
	// 	if (accountA.get('lastRehearsal') < accountB.get('lastRehearsal')) return -1;
	// 	if (accountA.get('lastRehearsal') > accountB.get('lastRehearsal')) return 1;
	// 	return 0;
	// });

	//changePage? Update?
	accountPage.renderAccountList(false);
}

