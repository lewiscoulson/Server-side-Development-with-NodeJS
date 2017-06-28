var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

function auth(req, res, next) {
	console.log(req.headers);
	var authHeader = req.headers.authorization;
	if (!authHeader) {
		var err = new Error('no authorization header');
		err.status = 401;2
		next(err);
		return;
	}
	var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');

	var user = auth[0];
	var password = auth[1];

	if (user === 'admin' && password === 'password') {
		next();
	} else {
		var err = new Error('you are not authenticated');
		err.status = 401;
		next(err);
	}
}

app.use(auth);

app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next) {
	res.writeHead(err.status || 500, {
		'WWW-Authenticate': 'BASIC',
		'Content-Type': 'text/plain'
	});
	res.end(err.message);
});

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});