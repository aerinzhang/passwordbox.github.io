document.addEventListener('deviceReady', function(){
    window.util = new Util();
    window.util.patchFnBind();
    window.util.transitioner = new Transitioner();
    window.util.transitioner.fadeOut($('#splashScreen'), 
                                     $('#splashScreen').remove);
    new App();
});
