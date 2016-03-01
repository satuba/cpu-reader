var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var routes = express.Router();

app.use(express.static(__dirname + "/app"));

require("./routes/routes.js")(routes);

app.use(routes);

app.listen(port, function() {
  console.log("--server is running on port " + port + "--");
});