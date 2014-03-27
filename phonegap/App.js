var App = function(){
    this.setup();   
}

App.prototype = {
    setup: function(){

        this.list = $('#list');

        this.backButton = $('#back');
        this.backButton.onButtonTap(this.switchBack.bind(this));

        this.pages = [];

        this.addPage(AccelerometerPage, '#gotoAccelerometer');
        this.addPage(CameraPage, '#gotoCamera');
        this.addPage(ConnectionPage, '#gotoConnection');
        this.addPage(DevicePage, '#gotoDevice');
        this.addPage(GeolocationPage, '#gotoGeolocation');
        this.addPage(FilePage, '#gotoFile');

        document.addEventListener('backButton', this.switchBack.bind(this));
    },

    addPage: function(Constructor, buttonSelector){
        var page = new Constructor();
        this.pages.push(page);
        var button = $(buttonSelector);
        button.onButtonTap(this.createSwitchTo(page));
    },
    
    createSwitchTo: function(newView){
        return function(){
            this.switchTo(newView);
        }.bind(this);
    },

    switchTo: function(newView){
        newView.start();
        this.currentView = newView;
        window.util.transitioner.slideFromRight(this.list, newView.div);
        window.util.transitioner.fadeIn(this.backButton);
    },

    switchBack: function(){
        if (this.currentView === undefined){
            navigator.app.exitApp();
            return;
        }
        window.util.transitioner.fadeOut(this.backButton);
        window.util.transitioner.slideFromLeft(this.list, this.currentView.div, function(){
            this.currentView.stop();
            this.currentView = undefined;
        }.bind(this));
    }
}
