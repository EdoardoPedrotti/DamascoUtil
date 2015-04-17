/**
 * New node file
 */

function replica(socket) {
	var async = require('async');
	var express = require('express');
	var router = express.Router();
	var fs = require('fs');
	var soap = require('soap');
	
	var io = socket;
	
	io.on('req', function(data){
		console.log('sockeeeeeeeeeeeeeeeeeeeeeeet')
		console.log(data);
	});

	var tagToRemove = [ 'targetNSAlias', 'targetNamespace' ];
	var jsonList = null;
	fs.readFile('./impostazioni/listaWs', 'utf-8', function(err, data) {
		if (err) {
			// console.log(err);
			return;
		}
		// console.log('lista ws importata con successo');
		// console.log(data);
		if (data) {
			jsonList = JSON.parse(data);
		}
		// console.log(jsonList);
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
			createResponse(url, tipoWs, res);
		} else {
			res.render('wsView', {
				nome : tipoWs,
				url : url,
				corpo : null
			});
		}

		// res.send(req.query.id);
	});
	router.post('/ws/post/*', function(req, res) {
		// console.log('ricevuto post')
		// console.log(req.body);
		console.log(req.body.tutto);
		var parsedBody = JSON.parse(req.body.tutto);
		var url = 'http://10.16.237.170:24462/Damasco/services/DMSGetContratto?wsdl';
		soap.createClient(url, function(err, client) {
			client.getContratto(parsedBody, function(err, results){
				console.log(results);
				res.send(results);
			});
		});
//		var toSend = JSON.stringify(parsedBody, null, 2);
//		console.log(JSON.stringify(toSend, null, 2));
//		res.send(toSend);
	})

	// auxiliary functions

	// recursively look for a property
	function recursiveGetProperty(obj, lookup, callback) {
		for ( var property in obj) {
			if (property === lookup) {
				callback(obj[property]);
			} else if (obj[property] instanceof Object) {
				recursiveGetProperty(obj[property], lookup, callback);
			}
		}
	}

	// recursively find and delete an object property
	function recursiveDelProperty(obj, lookup, callback) {
		for ( var property in obj) {
			if (property === lookup) {
				// console.log('deleting ' + JSON.stringify(obj[property], null,
				// 2));
				delete obj[property];
			} else if (obj[property] instanceof Object) {
				recursiveDelProperty(obj[property], lookup, callback);
			}
		}
	}
	
	
	//finds methods of ws Definition, definition must be JSON object
	function recursiveFindMethodBounded(wsDefinition, depth = 3 ){
		@TODO
	}



	// get ws definition as a javascript object
	function getWsDefinition(callback, url) {
		// raggiunge definizione ws
		// console.log('url: ' + url);
		soap.createClient(url, function(err, client) {
			var ws = client.describe();
			 console.log(JSON.stringify(ws, null, 2));
			callback(null, ws);
		});
	}

	// remove tags from a list
	function removeTags(tagsList, data, callback) {
		// console.log('rimozione tag inutili');

		var cj = data;
		for (var tag = 0; tag < tagsList.length; tag++) {

			recursiveDelProperty(data, tagsList[tag], function(cleanJson) {
				cj = cleanJson;

			});
		}
		// console.log(JSON.stringify(cj, null, 2));
		callback(null, cj);
	}

	function renderPage(err, results, response, nome, url) {
		// / page rendering

		if (err) {
			// risponde con errore
			console.log('ERRORE!')
			response.render('wsView', {
				nome : nome,
				url : url,
				err : err
			});
		} else {
			console.log('nessun errore, renderizzo pagina')
			response.render('wsView', {
				nome : nome,
				url : url,
				corpo : results['fields']
			});
		}

	}

	function createResponse(url, nomeWs, res) {
		var tipoWs = nomeWs;
		var url = url;
		async.waterfall([ function(callback) {
			getWsDefinition(callback, url);
		}, function(data, callback) {
			// toglie tag inutili
			removeTags(tagToRemove, data, callback);
		}, function(dataIn, callback) {
			// seleziona input
			// console.log('selezione tag input');
			// console.log(JSON.stringify(dataIn, null, 2));
			recursiveGetProperty(dataIn, 'input', function(data) {
				// console.log(JSON.stringify(data, null, 2));

				toReturn = {
					'fields' : data
				};
				callback(null, toReturn);

			});

		} ], function(err, results) {
			renderPage(err, results, res, tipoWs, url);
		});
	}
	
	return router;
}


// / exports
module.exports = replica;
