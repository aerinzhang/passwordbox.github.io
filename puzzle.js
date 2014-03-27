var board;
var moves;
var power = 2;

function randomMoves(len, mess){
	var initboard;
	if (len === 3) {
		initboard = [[1,2,3],[4,5,6],[7,0,8]]
	} else if (len === 4) {
		initboard = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,0,14,15]]
	} else {
		initboard = [[1,2,3, 4,5] ,[6,7,8,9,10], [11,12,13,14,15], [16,17,18,19,20], [21,22,23,24,0]]
	}
	var size = Math.pow(len, 2);
	while (mess > 0) {
		for (var i=0; i<size; i++) {
			var row = Math.floor(i/len);
			var col = i%len;
			if (initboard[row][col] === 0){
				var emptyrow = row;
				var emptycol = col;
			}
		};
		var upmove = ((emptyrow - 0)>0) ? 1 : 0;
		var downmove = ((len - 1 - emptyrow)>0) ? 2 : 0;
		var leftmove = ((emptycol - 0)>0) ? 3 : 0;
		var rightmove = ((len - 1 - emptycol)>0) ? 4 : 0;
		var movelist = [upmove, downmove, leftmove, rightmove];
		var randlist = [];
		for (var j=0; j<4; j++) {
			var val = movelist[j];
			if (val > 0){
				randlist.push(val);
			}
		}
		//randlist is a valid move list
		var randmove = randlist[Math.floor(Math.random()*(randlist.length))];
		var crow = emptyrow;
		var ccol = emptycol;
		if (randmove == 1) {
			//move up
			crow -= 1;
		}
		else if (randmove == 2) {
			//move down
			crow += 1;
		}
		else if (randmove == 3) {
			//move left
			ccol -= 1;
		}
		else {
			ccol += 1;
		}
		var target = initboard[crow][ccol];
		initboard[emptyrow][emptycol] = target;
		initboard[crow][ccol] = 0;
		mess -= 1;
	}
	return initboard;
}

function three(e){
	e.preventDefault();	
	moves = 0;
	board = randomMoves(3, Math.pow(10, power));
	redrawThree();
	return false;
}

function four(e){
	e.preventDefault();
	moves = 0;
	board = randomMoves(4, Math.pow(10, power));
	redrawFour();
	return false;
}

function five(e){
	e.preventDefault();
	moves = 0;
	board = randomMoves(5, Math.pow(10, power));
	redrawFive();
	return false;
} 

function redrawThree() {
	console.log("redrawThree called");
	var blist = [board[0][0], board[0][1], board[0][2], board[1][0], board[1][1], board[1][2], board[2][0], board[2][1], board[2][2]];
	for (var i=0; i<9; i++) {
		if (blist[i] === 0) {
			blist[i]= '';
		}
	}
	$("#board").html('');
	$("#board").attr('class', 'ui-grid-b');
	$("#board").append('<div class="ui-block-a" id="tile' + blist[0] + '">' + blist[0] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[1] + '">' + blist[1] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[2] + '">' + blist[2] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[3] + '">' + blist[3] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[4] + '">' + blist[4] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[5] + '">' + blist[5] + '</div>' +
					   '<div class="ui-block-a" id="tile' + blist[6] + '">' + blist[6] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[7] + '">' + blist[7] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[8] + '">' + blist[8] + '</div>');
	$("#moveboard").html('Moves: ' + moves);
	if (checkWin(board)) $.mobile.changePage("#popBasic");
}

function redrawFour(){
	console.log("redrawFour called");
	var blist = [board[0][0], board[0][1], board[0][2], board[0][3],
				 board[1][0], board[1][1], board[1][2], board[1][3],
				 board[2][0], board[2][1], board[2][2], board[2][3],
				 board[3][0], board[3][1], board[3][2], board[3][3],				 
				 ];

	for (var i=0; i<16; i++) {
		if (blist[i] === 0) {
			blist[i]= '';
		}
	}
	$("#board").html('');
	$("#board").attr('class', 'ui-grid-c');
	$("#board").append('<div class="ui-block-a" id="tile' + blist[0] + '">' + blist[0] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[1] + '">' + blist[1] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[2] + '">' + blist[2] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[3] + '">' + blist[3] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[4] + '">' + blist[4] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[5] + '">' + blist[5] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[6] + '">' + blist[6] + '</div>' +
					   '<div class="ui-block-d" id="tile' + blist[7] + '">' + blist[7] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[8] + '">' + blist[8] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[9] + '">' + blist[9] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[10] + '">' + blist[10] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[11] + '">' + blist[11] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[12] + '">' + blist[12] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[13] + '">' + blist[13] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[14] + '">' + blist[14] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[15] + '">' + blist[15] + '</div>');
	$("#moveboard").html('Moves: ' + moves);
	if (checkWin(board)) $.mobile.changePage("#popBasic");
}
function redrawFive(){
	console.log("redrawFive called");
	var blist = [board[0][0], board[0][1], board[0][2], board[0][3], board[0][4],
				 board[1][0], board[1][1], board[1][2], board[1][3], board[1][4],
				 board[2][0], board[2][1], board[2][2], board[2][3], board[2][4],
				 board[3][0], board[3][1], board[3][2], board[3][3], board[3][4],
				 board[4][0], board[4][1], board[4][2], board[4][3], board[4][4],
				 ];

	for (var i=0; i<25; i++) {
		if (blist[i] === 0) {
			blist[i]= '';
		}
	}
	$("#board").html('');
	$("#board").attr('class', 'ui-grid-d');
	$("#board").append('<div class="ui-block-a" id="tile' + blist[0] + '">' + blist[0] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[1] + '">' + blist[1] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[2] + '">' + blist[2] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[3] + '">' + blist[3] + '</div>' + 
					   '<div class="ui-block-e" id="tile' + blist[4] + '">' + blist[4] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[5] + '">' + blist[5] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[6] + '">' + blist[6] + '</div>' +
					   '<div class="ui-block-c" id="tile' + blist[7] + '">' + blist[7] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[8] + '">' + blist[8] + '</div>' + 
					   '<div class="ui-block-e" id="tile' + blist[9] + '">' + blist[9] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[10] + '">' + blist[10] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[11] + '">' + blist[11] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[12] + '">' + blist[12] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[13] + '">' + blist[13] + '</div>' + 
					   '<div class="ui-block-e" id="tile' + blist[14] + '">' + blist[14] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[15] + '">' + blist[15] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[16] + '">' + blist[16] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[17] + '">' + blist[17] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[18] + '">' + blist[18] + '</div>' + 
					   '<div class="ui-block-e" id="tile' + blist[19] + '">' + blist[19] + '</div>' + 
					   '<div class="ui-block-a" id="tile' + blist[20] + '">' + blist[20] + '</div>' + 
					   '<div class="ui-block-b" id="tile' + blist[21] + '">' + blist[21] + '</div>' + 
					   '<div class="ui-block-c" id="tile' + blist[22] + '">' + blist[22] + '</div>' + 
					   '<div class="ui-block-d" id="tile' + blist[23] + '">' + blist[23] + '</div>' + 
					   '<div class="ui-block-e" id="tile' + blist[24] + '">' + blist[24] + '</div>');

	$("#moveboard").html('Moves: ' + moves);
	if (checkWin(board)) $.mobile.changePage("#popBasic");
}
function checkWin(gameboard){
	var len = gameboard.length;
	var size = Math.pow(len, 2);
	var count = 1;
	for (var i=0; i<size-1; i++) {
		var row = Math.floor(i/len);
		var col = i%len;
		if (gameboard[row][col] !== count) {
			return false;
		}
		count += 1;
	}
	return true;
}
function moveBoard(gameboard, target){
	var change = false;
	var len = gameboard.length;
	var size = Math.pow(len, 2);
	for (var i=0; i<size; i++) {
		var row = Math.floor(i/len);
		var col = i%len;
		if (gameboard[row][col] === 0){
			var emptyrow = row;
			var emptycol = col;
		}
		if (gameboard[row][col] === target) {
			var targetrow = row;
			var targetcol = col;
		}
	}
	if ((Math.abs(emptyrow-targetrow) + Math.abs(emptycol-targetcol)) === 1){
		change = true;
		//move target $ empty
		gameboard[emptyrow][emptycol] = target;
		gameboard[targetrow][targetcol] = 0;
		moves += 1;
	}
	return gameboard;
}

function moveTile(e) {
	e.preventDefault();
	var targetid = e.target.id;
	var targetindex = parseInt(targetid.slice(4));
	board = moveBoard(board, targetindex);
	if (board.length === 3) {
		redrawThree();
	} else if (board.length === 4){
		redrawFour();
	} else {
		redrawFive();
	}
}

function level1(e) {
	e.preventDefault();
	power = 1;
}
function level2(e) {
	e.preventDefault();
	power = 2;
}
function level3(e) {
	e.preventDefault();
	power = 3;
}
function level4(e) {
	e.preventDefault();
	power = 4;
}
function level5(e) {
	e.preventDefault();
	power = 5;
}

$( document ).ready(function(){
	$('#l1').click(level1);
	$('#l2').click(level2);
	$('#l3').click(level3);
	$('#l4').click(level4);
	$('#l5').click(level5);
	$('#three').click(three);
	$('#four').click(four);
	$('#five').click(five);
	$('#board').click(moveTile);
})