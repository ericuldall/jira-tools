'use strict';

const inquirer = require('inquirer');
const fs = require('fs');
const config = require('config');
const spawn = require('child_process').spawn;
const util = require('util');
const os = require('os');

class Auth {

	static interactive(){
		return inquirer.prompt(config.jtools.prompt.auth[0]).then(Auth.storeCredentials);
	}

	static storeCredentials(opts){
		var env_file = fs.writeFileSync(
			os.homedir() + "/.jtools", 
			util.format(
				'export JTOOLS_AUTH_USER="%s"\nexport JTOOLS_AUTH_PASSWORD="%s"\nexport JTOOLS_API_URL="%s"',
				opts.authUser, 
				new Buffer(opts.authPass).toString("base64"),
				opts.authUrl
			)
		);
		var bashrc = fs.readFileSync(os.homedir() + "/.bashrc").toString();
		if( !(bashrc.match('.jtools')) ){
			fs.appendFileSync(os.homedir() + "/.bashrc", "source " + os.homedir() + "/.jtools\n");
		}

		return true;
	}
}

module.exports = Auth;
