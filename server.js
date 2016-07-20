var http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var mysql = require('mysql')
//test
var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }

});

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processAllFieldsOfTheForm(req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });


	var connection = mysql.createConnection({
		host 	: '192.168.1.23',
		user	: 'internproject',
		password: 'internproject',
		database: 'internproject'
	});
	connection.connect();
	var temp = fields.password;
	connection.query('SELECT * FROM UserTable WHERE UserName = ' + '\'' + fields.username + '\';', function(err, rows, fields) {
		console.log(rows);
		if (!err){

			if(typeof rows != 'undefined'){
				if(rows[0] != undefined && temp==rows[0].Password){

                                	// sign with default (HMAC SHA256)
					var jwt = require('jsonwebtoken');
					// sign with RSA SHA256
					var cert = fs.readFileSync('private.key');  // get private key
					var token = jwt.sign({UserName: rows[0].UserName} , cert, { algorithm: 'RS256'});

					// sign asynchronously
					jwt.sign({UserName: rows[0].UserName} , cert, { algorithm: 'RS256' }, function(err, token) {
  						console.log(token);
					});


					// get the decoded payload ignoring signature, no secretOrPrivateKey needed
					var decoded = jwt.decode(token);

					// get the decoded payload and header
					var decoded = jwt.decode(token, {complete: true});
					console.log(decoded.header);
					console.log(decoded.payload)


					res.write(token);

					res.write('\n login successful');

          //var tokenJSON = JSON.stringify(token);
        //  res.send(tokenJSON);
				} else {
					res.write('login unsuccessful');
				}
			}
		}
		else {
	  		console.log('Error while performing Query.');
		}
		res.end();
	});

	connection.end();

    });
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
