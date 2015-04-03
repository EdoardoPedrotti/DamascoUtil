/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var soap = require('soap');
var jsonList = null;
fs.readFile('./impostazioni/listaWs', 'utf-8', function(err, data) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('lista ws importata con successo');
	console.log(data);
	if (data) {
		jsonList = JSON.parse(data);
	}
	console.log(jsonList);
});

router.get('/', function(req, res) {
	res.render('replica', {
		lista : jsonList
	});
});

router.get('/ws/', function(req, res) {
	var tipoWs = req.query.id;
	var url = jsonList.sviluppo[tipoWs].url
	if (url) {
		var args = {
			name : 'value'
		};
		soap.createClient(url, function(err, client) {
			recursiveGetProperty(client.describe(), 'input', function(data) {
				console.log(JSON.stringify(data, null, 2));
				res.render('wsView', {
					nome : tipoWs,
					url : url,
					corpo : data
				});
			})

		});
	} else {
		res.render('wsView', {
			nome : tipoWs,
			url : url,
			corpo : null
		});
	}

	// res.send(req.query.id);
});

//auxiliary functions

function recursiveGetProperty(obj, lookup, callback) {
	for (var property in obj) {
		if (property === lookup) {
			callback(obj[property]);
		} else if (obj[property] instanceof Object) {
			recursiveGetProperty(obj[property], lookup, callback);
		}
	}
}

// / exports
module.exports = router;