var http = require('http')
var port = process.env.PORT || 3000;
var fs = require('fs');
var os = require('os');

var info = os.cpus();

fs.readFile('./index.html', function(err, html) {
        if(err){
          throw err;
        }
        http.createServer(function(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
        }).listen(port, function(){
          console.log('server running on port '+ port);
          console.log('cpu info: ', info);
        });
});
