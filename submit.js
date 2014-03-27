console.log("HERE");
var infoname = $('#name').val()
if (infoname != '') {
	$("#confirm-info div").append("<p> Name: " + infoname + "</p>")
	$("#list").append("<li>" + infoname + "</li>")
}