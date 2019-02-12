'use strict';

var config = require('config');
var request= require('request-promise');

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

	static call(opts){
		var url = config.jtools.api.url + config.jtools.api.path + config.jtools.api.version + opts.path;
		var req_opts = {
			url: url,
			auth: API.getAuth(),
			method: opts.method || 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
      resolveWithFullResponse: true
		};
		if( opts.body ){
			req_opts.body = JSON.stringify(opts.body);
		}
		return Promise.resolve().then(() => {
			return request(req_opts).then(res => {
				let json;
				try {
					json = JSON.parse(res.body);
				} catch(e) {
					if (res.statusCode >= 400) {
						throw new Error('Invalid response(' + res.statusCode + ')!');
					} else {
						json = {success: true}
					}
				}
				if( json.hasOwnProperty('errorMessages') && json.errorMessages.length ){
					throw new Error(json.errorMessages.join("\n"));
				}
				if( json.hasOwnProperty('errors') ) {
					throw new Error(JSON.stringify(json.errors));
				}
				return json;
			});
		});
	}
}

module.exports = API;
