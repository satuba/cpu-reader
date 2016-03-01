var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var routes = express.Router();
var child_process = require('child_process');

function updateData(){
	child_process.exec('luajit jsonfythis.lua meminfo', function(error, stdout, stderr){
  		console.log(stdout);
	});
}
setInterval(updateData, 1000);

app.use(express.static(__dirname + "/app"));

require("./routes/routes.js")(routes);

app.use(routes);

app.listen(port, function() {
  console.log("--server is running on port " + port + "--");
});
