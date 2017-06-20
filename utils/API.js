'use strict';

var config = require('config');
var request= require('request');

class API {

	static getAuth(){
		if( config.jtools.auth.user === false || config.jtools.auth.password === false ){
			throw new Error('JTOOLS ERROR: Please authenticate!');
		}
		return {
			user: config.jtools.auth.user.trim(),
			pass: new Buffer(config.jtools.auth.password, 'base64').toString('ascii').trim()
		}
	}

	static call(opts, cb){
		var url = config.jtools.api.url + config.jtools.api.path + config.jtools.api.version + opts.path;
		var req_opts = {
			url: url,
			auth: API.getAuth(),
			method: opts.method || 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		if( opts.body ){
			req_opts.body = JSON.stringify(opts.body);
		}
		request(req_opts, function(err, res, body){
			if( err ){
				throw new Error('JTOOLS API ERROR: ' + err);
			}
			var json = JSON.parse(body);
			if( json.hasOwnProperty('errorMessages') ){
				throw new Error(json.errorMessages.join("\n"));
			}
			cb(JSON.parse(body));
		});
	}
}

module.exports = API;
