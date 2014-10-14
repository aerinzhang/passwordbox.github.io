var accountPage = (function() {
	var module = {};
	var PERSON_INDEX = 0;
	var SCENE_INDEX = 1;
	var updateListBool = true;

	function isWebsite (web) {
	//check empty/same account entered
		return true;
	}

	function submitFunction (e) {
		if ( ((e.keyCode === 13) || (e.keyCode == undefined)) 
				&& ($("#entry:focus")) ) {
			e.preventDefault();

			var accountID = 'button' + storyMode.accountIndex;
			var account = $('#accountName').val();
			$('#accountName').val('');

			//if pass validation of website input
			if ( isWebsite(account) ) {
				var eString = 'list'+ storyMode.accountIndex;
				var buttonID = '#' + accountID;
				var listID = '#' + eString;

				$('.images').css('text-align','center');

				//generate next story of four & make sure the 4?6?8-story combination is unique
				var level = "setFamily." + 
						storyMode.securityLevel.toLowerCase();
				var args = "(" + storyMode.accountIndex + ")";
				var functionName = level.concat(("SecurityIthAccount" + args));
				var cueList = eval(functionName);

				//Put in Dropbox! Need Another Module!!!! FIX LATER
				//calculate cue (person-scene pairs from the story list)
				var storyList = calculateCuePairsFromIndices(cueList);
				programVariables.insertAccount(
						account, storyList, storyMode.accountIndex);

				//?storyMode.accountIndex += 1;
				updateStoryRefCount(account, cueList);
				renderAccountList(true);
			}
		} else {
			alert('Warning: Account entered is not valid');
		}
		return false
	}

	function calculateCuePairsFromIndices (cueList) {	
		var record;
		var person;
		var scene;
		var stories = programVariables.storyBankTable.query();
		var result = [];
		for (var i=0; i<cueList.length; i++) {
			record = stories[cueList[i]-1];
			person = record.get('person');
			scene = record.get('scene');
			result.push(person + '|||' + scene);
		}
		return result;

	}

	function updateAccountListWrapper () {
		var recprds = programVariables.accountTable.query();
		//by rehearsal date?
		renderAccountList(false);
		return;
	}

	function updateStoryRefCount (webName, accountList) {
		//refer to page
	}

	//CONTROLLER
	module.submit = function (e) {
		submitFunction(e);
		return;
	}

	module.updateAccountList = function () {
		updateAccountListWrapper();
		return;
	}

	//VIEW
	function renderEachAccountElements (time, accountName, list, index) {
		//check duplicates?

		//create html for each page
		var html = "<div id='" + accountName + "Stories'>";
		for (var i=0; i < list.length; i ++) {
			if (i % 2 == 0) {
				var liold = "\
						<div class=twoPairs><span class='pairdiv'>\
						<figure><img class=pair src=images/person/{0}.jpg />\
						<figcaption>{1}</figcaption></figure><figure>\
						<img class=pair src=images/scene/{2}.jpg />\
						<figcaption>{3}</figcaption></figure></span>";
			} else {
				var liold = "\
						&nbsp&nbsp<span class='pairdiv'><figure>\
						<img class=pair src=images/person/{0}.jpg />\
						<figcaption>{1}</figcaption></figure><figure>\
						<img class=pair src=images/scene/{2}.jpg /><figcaption>\
						{3}</figcaption></figure></span></div>";
			}
			var li = String.format(liold, list[i][PERSON_INDEX], 
					list[i][PERSON_INDEX].split('_').join(' '),
					list[i][SCENE_INDEX].toLowerCase(), 
					list[i][SCENE_INDEX].split('_').join(' '));
		
			html += li;
		}

		html += "</div><br><input type='text' autocorrect='off' name='password'\
				 id='"+accountName+"-password' value='' placeholder='Type in \
				 your password' autofocus='autofocus'/>\<a href=# \
				 data-role='button' data-rel='popup' \
				 onclick='checkPasswordNew(\""  + accountName + "\", " + 
				 index + ")' > Rehearse Account</a>";

		return html;
	}

	function parseStringToNestedArrays (stringOfArray) {
		var result = [];
		for (var i=0; i < stringOfArray.length(); i++) {
			var li = stringOfArray.get(i).split('|||'); 
			result.push(li);
		}
		return result;
	}

	function renderAccountList (changePageBool) {
		var accounts = programVariables.accountTable.query();
		var accountIndex = programVariables.accountIndex;
		var stories = storyMode.storyBank;

		if (stories.length >= 0) {
			for (var i=0; i < accounts.length; i++) {
				var account = accounts[i];
				var temp = account.get('storyList');
				var list = parseStringToNestedArrays(account.get('storyList'));
				var accountName = account.get('account');
				var accountIndexForChecking = account.get('accountIndex');
				var time = '0PM';
				//var time = record.get('lastRehearsal').toString();
				var pageHtml = renderEachAccountElements(time, accountName, 
						list, accountIndexForChecking);

				var newPage = $("\
						<div data-role='page' data-title='" + accountName + 
						"' id=" + accountName + "Page><div data-role='header'\
						data-position=fixed><a href=#accounts \
						data-icon='back'>Back</a><h1>"+ accountName + 
						"</h1></div><div data-role='content' \
						class=images>"+ pageHtml + " </div></div>");
				
				if ( updateListBool || 
					(changePageBool && i==accounts.length-1) ) {

					//if insert the first time
					var keyID = 'button' + accountIndex;
					var eString = 'list'+ accountIndex;
					var buttonID = '#' + keyID;
					var listID = '#' + eString;
					$("#list").append( "\
							<li id=" + accountName + "><a href=#" + accountName 
							+ "Page id=" + keyID + " data-wrapperels=\
							'span' data-inline='true' data-icon='delete'\
							 data-iconpos='right' data-theme='a'>" 
							+ accountName + "</a></li>");

					if ($('#list').hasClass('ui-listview')) {
						$('#list').listview('refresh');
					} else {
						$('#list').trigger('create');
					}

					if (updateListBool || 
						(changePageBool && i==accounts.length-1)) {
						newPage.appendTo( $.mobile.pageContainer );
					}
				}
			}
			//update the account page
		} else {
			//alert('play the game to unlock more stories!');
		}
		if (changePageBool) {
			storyMode.accountIndex += 1;
			programVariables.generalRecord.set("accountIndex", 
					storyMode.accountIndex);
			//programRecord.set('accountIndex', accountIndex);
			$.mobile.changePage(newPage);
		}
		updateListBool = false;
	}
	return module;
}());