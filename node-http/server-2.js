var http = require('http');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function(req, res) {
	var fileName;
	var filePath;
	var fileExt;

	console.log('Request for ' + req.url + ' by method ' + req.method);

	if (req.method === 'GET') {
		if (req.url === '/') {
			fileName = '/index.html';
		} else {
			fileName = req.url;
		}

		filePath = path.resolve('./public' + fileName);

		fileExt = path.extname(filePath);

		if (fileExt === '.html') {
			fs.exists(filePath, function(exists) {
				if (!exists) {
		        	res.writeHead(404, { 'Content-Type': 'text/html' });
		        	res.end('<html><body><h1>Error 404: ' + fileName + 
		                        ' not found</h1></body></html>');
		        	return;
		         }

		        res.writeHead(200, { 'Content-Type': 'text/html' });
          		fs.createReadStream(filePath).pipe(res);
			});
		} else {
	        res.writeHead(404, { 'Content-Type': 'text/html' });
	        res.end('<html><body><h1>Error 404: ' + fileName + 
	                ' not a HTML file</h1></body></html>');
    	}
	} else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Error 404: ' + req.method + 
                ' not supported</h1></body></html>');
  	}
});

server.listen(port, hostname, function() {
	console.log(`server running at http://${hostname}:${port}`);
});