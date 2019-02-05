'use strict';

var API = require('./API');

class Jira {

	static getVersions(project){
		return API.call({
			path: '/project/' + project + '/versions',
		});
	}

	static createVersion(body){
		return API.call({
			path: '/version',
			body: body,
			method: 'POST'
		});
	}

	static updateVersion(id, body){
		return API.call({
			path: '/version/' + id,
			body: body,
			method: 'PUT'
		});
	}

	static getIssues(jql){
		return API.call({
			path: '/search?jql=' + jql
		});
	}

}

module.exports = Jira;
