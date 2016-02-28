var http = require('http')
var port = process.env.PORT || 3000;
var fs = require('fs');

var obj;

fs.readFile('./result.json', 'utf8', function(err, data) {
  if(err) throw err;
  obj = JSON.parse(data);
  fs.writeFile('./index.html', obj.meminfo.Active.size, function (err) {
    if (err) throw err;
    console.log('The data was appended to file.');
    fs.readFile('./index.html', function(err, html) {
      if(err) throw err;
      http.createServer(function(req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
      }).listen(port, function(){
        console.log('server running on port '+ port);
        console.log('cpu info: ', obj.meminfo.Active);
      });
    });
  });
});

