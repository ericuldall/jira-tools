'use strict';

const util = require('util');
const qs  = require('querystring');
const API = require('./API');

class Jira {

	static getVersions (project) {
		return API.call({
			path: util.format('/project/%s/versions', project),
		});
	}

	static createVersion (body) {
		return API.call({
			path: '/version',
			body,
			method: 'POST'
		});
	}

	static updateVersion (id, body) {
		return API.call({
			path: util.format('/version/%s', id),
			body,
			method: 'PUT'
		});
	}

	static getIssues (opts) {
		return API.call({
			path: util.format('/search?%s', qs.stringify(opts))
		});
	}

	static updateIssue (id, body) {
		return API.call({
			path: util.format('/issue/%s', id),
			body,
			method: 'PUT' 
		});
	}
	
	static transitionIssue (id, body) {
		return API.call({
			path: util.format('/issue/%s/transitions', id),
			body,
			method: 'POST' 
		});
	}

	static getIssueTransitions (id) {
		return API.call({
			path: util.format('/issue/%s/transitions', id)
		});
	}

	static getUser (id) {
		return API.call({
			path: util.format('/user?accountId=%s', id)
		});
	}
}

module.exports = Jira;
