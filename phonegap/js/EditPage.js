var mycanvas;
var ctx;

function addText(str, x, y) {
	//	ctx.font="bold 50pt Calibri";
	ctx.fillText(str, x, y);
}



function handleSubmit() {
	upperVar = $('#upper');
	//	lowerVar  = $('#lower');
	var EMPTY = "";


	$('.submit').click(function(e) {
		e.preventDefault();


		if(upperVar.val() != EMPTY) {
			var xPosVar = $('#xPosition');
			var yPosVar = $('#yPosition');
			var pColor = $('#penColor');
			var fSize = $('#fontSize');
			ctx.fillStyle = pColor.val();
			ctx.font = "bold " + fSize.val() + "pt Calibri";

			addText(upperVar.val(), xPosVar.val(), yPosVar.val());
			upperVar.val('');
		}
	});

}

/*
//*********** handle freehand mouse events on canvas (for windows) **************
function handleMouseEvents() {
//	var mycanvas = document.getElementById('canvas1');
//	var ctx = mycanvas.getContext("2d");
	var mousedown = false;
	ctx.strokeStyle = '#0000FF';
	ctx.lineWidth = 5;

	mycanvas.onmousedown = function(e) {
		e.preventDefault();
		var pos = fixPosition(e, mycanvas);
		mousedown = true;
		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
		return false;
	};

	mycanvas.onmousemove = function(e) {
		e.preventDefault();
		var pos = fixPosition(e, canvas);
		if (mousedown) {
			ctx.lineTo(pos.x, pos.y);
			ctx.stroke();
		}
	};

	mycanvas.onmouseup = function(e) {
		mousedown = false;
	};

}

//********** utils ******************
// Thanks to http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/4430498#4430498
function fixPosition(e, gCanvasElement) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    } 
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    return {x: x, y:y};
}
*/

var points = {};
var paths = -1;

function getCoord(evt) {
	var x = evt.touches[0].pageX - mycanvas.offsetLeft;
	var y = evt.touches[0].pageY - mycanvas.offsetTop;
	return [x, y];
}


function touchstart(evt) {
	var pSize = $('#penSize');
	var pColor = $('#penColor');
	ctx.lineWidth = pSize.val();
	ctx.strokeStyle = pColor.val();

	evt.preventDefault();

	var coord = getCoord(evt);
	paths = paths + 1;
	points[paths] = [];
	points[paths].push(coord);

	ctx.beginPath();
	ctx.moveTo(coord[0], coord[1]);
}

function touchmove(evt) {

	evt.preventDefault();

	var coord = getCoord(evt);
	points[paths].push(coord);
	ctx.lineTo(coord[0], coord[1]);
	ctx.stroke();
}

$(document).ready(function() {
	mycanvas = document.getElementById("canvas1");
	ctx = mycanvas.getContext("2d");
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#0000FF';

	handleSubmit();

	//  for freehand drawing on windows
	//	handleMouseEvents();
	// freehand for mobile devices
	mycanvas.addEventListener("touchstart", touchstart, true);
	mycanvas.addEventListener("touchmove", touchmove, true);
});