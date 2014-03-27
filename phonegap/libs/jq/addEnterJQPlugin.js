function addEnterJQPlugin(){
    // `this` is the jquery wrapper for the element
    // Functions on `$.fn` can be accessed by any jQuery object
    // * Example: `$('#loc').onenter(fn)`
    $.fn.onenter = function(cb){
        // bind the callback to the jQuery object (standard jQuery behavior)
        cb = cb.bind(this);
        this.keypress(function(e){
            // 13 === enter key
            if (e.which === 13){
                e.preventDefault();
                cb();
            }
        });
    }
}

// Attach to load event so that we know jquery load first
window.addEventListener('load', function(){
    addEnterJQPlugin();
});
