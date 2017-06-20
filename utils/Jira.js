'use strict';

var API = require('./API');

class Jira {

	static getVersions(project, cb){
		API.call({
			path: '/project/' + project + '/versions',
		}, cb);
	}

	static createVersion(body, cb){
		API.call({
			path: '/version',
			body: body,
			method: 'POST'
		}, cb);
	}

	static updateVersion(id, body, cb){
		API.call({
			path: '/version/' + id,
			body: body,
			method: 'PUT'
		}, cb);
	}

}

module.exports = Jira;
