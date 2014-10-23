//modified from the BookmarkSpell GitRepo: https://github.com/hewigovens/BookmarkSpell/blob/master/src/js/popup.js

//

function testerFn() {
	alert('this is a tester');
}



//show users' account page from github.io
function addAccountsClicked() {
	console.log('==> add account page');
	chrome.tabs.create({url:'https://aerinzhang.github.io/#accounts'}, function(tab){console.log(tab);});
}	

//show users' bank page from github.io
function showBankClicked() {
	console.log('==> show bank page');
	chrome.tabs.create({url:'https://aerinzhang.github.io/#bank'}, function(tab){console.log(tab);});
}

function rehearseStoriesClicked() {
	console.log('==> rehearsal board page');
	chrome.tabs.create({url:'https://aerinzhang.github.io/#board'}, function(tab){console.log(tab);});
}
//show github repo
function aboutClicked() {
    console.log('==> about clicked');
    chrome.tabs.create({url:'https://github.com/aerinzhang/aerinzhang.github.io'}, function(tab){console.log(tab);});
}


//dynamically generate list to 
function generateList(){
	console.log('creating dynamic sublist');
	var accountTable = chrome.extension.getBackgroundPage().accountTable;
	var accounts = accountTable.query();
	console.log(accounts);
	var html = "<span id='link_page_to_account' name='link_page_to_account' title='Link Current Login Page to Account'>Link Current Login Page to Account</span>";//<ul id='submenu'>";
	for (var i=0; i<accounts.length; i++) {
		var accountName = accounts[i].get('account');
		html += "<li>" +  accountName + "</li>";
	}
	//html += "</ul>";
	document.getElementById('holder').innerHTML = html + chrome.extension.getBackgroundPage().currentTab;
}
//add current page url to account login info
function linkLoginPageToAccountClicked() {
	console.log('==>link current login page to account');

	//get the accountTable 
	var accountTable = chrome.extension.getBackgroundPage().accountTable;
	var accounts = accountTable.query();
	//dynamically create table view?
	chrome.tabs.getSelected(null, function(tab) {
		var tabURL = tab.url;
		console.log(tabURL);
		chrome.extension.getBackgroundPage().currentTab = tab.url;
	});
	//chrome.tabs.create({url:'accounts.html'}, function(tab){console.log(tab);});
	var html = "<span id='link_page_to_account' name='link_page_to_account' title='Link Current Login Page to Account'>\
	Link Current Login Page to Account</span><ul>";
	for (var i=0; i<accounts.length; i++) {
		var accountName = accounts[i].get('account');
		html += "<li>" +  accountName + "</li>";
	}
	html += "</ul>";
	document.getElementById('holder').innerHTML = html ;//+ chrome.extension.getBackgroundPage().currentTab;
}

function recentClicked() {
    console.log('==> open recent bookmarks page');
    chrome.runtime.sendMessage({action_page:'recent_bookmarks.html', from: document.URL});
    window.close();
}

function searchClicked() {
    console.log('==> search clicked');
    chrome.tabs.create({url:'chrome://bookmarks/'}, function(tab){console.log(tab);});
}


function viewNotesClicked() {
    console.log('==> notes for page clicked');
    chrome.runtime.sendMessage({action:'noteForPage', from: document.URL});
    window.close();
}

function viewDatastoreClicked () {
    console.log('==> view datastore clicked');
    chrome.tabs.create({url:'https://www.dropbox.com/developers/browse_datastores/545700'});
}

function manualSyncClicked(){
    console.log("==> manual sync clicked");
    chrome.runtime.sendMessage({action:'manualSync', from: document.URL});
    window.close();
}

//mail bug report to gmail
function reportBugClicked(){
    console.log('reportBugClicked');
    chrome.tabs.create({url:'mailto:aerin.zhang@gmail.com?subject=Report PasswordBox Bugs&body=I just found a bug:'});
}

window.addEventListener('load', function(){
	document.getElementById('add_accounts').onclick = addAccountsClicked;
	document.getElementById('show_bank').onclick = showBankClicked;
	document.getElementById('rehearse_stories').onclick = rehearseStoriesClicked;
	//document.getElementById('link_page_to_account').onclick = linkLoginPageToAccountClicked;
    //document.getElementById('recent_bookmarks').onclick = recentClicked;
    //document.getElementById('hosted_app').onclick = searchClicked;
    document.getElementById('about').onclick = aboutClicked;
    //document.getElementById('notes_for_page').onclick = viewNotesClicked;
    document.getElementById('report_bug').onclick = reportBugClicked;
    //document.getElementById('manual_sync').onclick = manualSyncClicked;
}, false);

$(document).ready(function(){
	console.log('creating dynamic sublist');
	var accountTable = chrome.extension.getBackgroundPage().accountTable;
	var accounts = accountTable.query();
	var html = '';
	for (var i=0; i<accounts.length; i++) {
		var accountName = accounts[i].get('account');
		html += "<li class='item' id='" + accountName + "Li'>" +  accountName + "</li>";
	}
	var temp = 'hi';
	$('#appleLi').click( function() {
		console.log(temp);
		window.close();
		return true;
	})
	$('#menu_accounts').html(html);
 	$("#menu_accounts").trigger('create');
 	var accountName;
 	var account;
 	for (var i=0; i<accounts.length; i++) {
 		account = accounts[i];
		accountName = account.get('account');
		$('#'+accountName + 'Li').click( { record: account }, 
				function (event) {
				// set login page to be current page
					chrome.tabs.getSelected(null, function(tab) {
						event.data.record.set('loginUrl', tab.url);
					});
					window.close();
				}

		);
	}

});











