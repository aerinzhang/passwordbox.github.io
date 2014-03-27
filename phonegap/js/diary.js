
function getDate(){
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var fstring = hours + ':' + minutes + ' ---- ' + month + '/' + day + '/' + year;
	$('#timeslot').html(fstring);
}

function initDiary(){
	var chore;
	var idstring;
	var count = 0;
	var buttonid;
	var isChrome = false;
	var inputbox = document.getElementById('tagentry');
	var addbutton = document.getElementById('tagadd');
	getDate();
	$('#tagadd').bind('touchstart', submit);
	function stopScrolling(touchEvent) {
		touchEvent.preventDefault();
	}
	//document.addEventListener('touchstart', stopScrolling, false);
	//document.addEventListener('touchmove', stopScrolling, false);
	//$(document).bind('touchmove', function(e) {
	//	e.preventDefault();
	//});
	
	function submit(e){
		e.preventDefault();
		idstring = count.toString();
		chore = $('#tagentry').val();
		var node = document.createElement('div');
		var jnode = $(node);
		jnode.attr('id', idstring);
		jnode.attr('class', 'things');
		buttonid = 'button' + count.toString();
		jnode.text(chore);
		jnode.append('<button id="' + buttonid + 
					 '" class= "button">X</button>');
		var jbuttonid = '#' + buttonid;
		$(jbuttonid).live('touchstart', function(e){
			var targetid = e.target.id;
			var choreid = targetid.slice(6);
			choreid = '#' + choreid;
			$(choreid).slideUp(400, function(){ $(this).remove();});
		});
		if (chore !== '') {
			jnode.hide();
			jnode.appendTo($('#taglist')).slideDown();
			$('#tagentry').val('');
		}
		count += 1;
	}
	function changeClass(){
	}
}