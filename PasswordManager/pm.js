var DROPBOX_APP_KEY = '8qw6cevpayp0vyd';
var client = undefined;
var dataStore = undefined;
var accountTable = undefined;
var storyBankTable = undefined;
var currentTab = undefined;

function stripStoryFromRecords(table) {
    var records = table.query();
    var storyList = [];
    for (var i = 0; i < records.length; i++ ){
        var record = records[i];
        storyList.push([record.get('person'), record.get('scene')]);
    }
    return storyList;
}


function setup() {
    client = new Dropbox.Client({key: DROPBOX_APP_KEY});
    client.authDriver(new Dropbox.AuthDriver.Chrome());

    credentials = localStorage.getItem('DropboxOAuth');
    if (credentials) {
        client.setCredentials(JSON.parse(credentials));
    }
    if (client.isAuthenticated()) {
        client.getDatastoreManager().openDefaultDatastore(
            function (error, datastore) {
                if (error) {
                    alert('Error opening default datastore: ' + error);
                }
                storyBankTable = datastore.getTable('stories');
                accountTable = datastore.getTable('accounts');
            });
    } else {
        client.authenticate(function(error, nclient) {
            if (error) {
                    console.log('==> authenticate failed:' + error);
                    return;
                } else {
                    localStorage.setItem('DropboxOAuth', JSON.stringify(nclient.credentials()));
                    openDefaultDatastore();
                }
            });
    }
}

function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('g') > -1) {
    // ... show the page action.
    alert('show url');
    chrome.pageAction.show(tabId);
  }
};

setup();