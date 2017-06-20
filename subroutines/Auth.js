var Termoil = require('termoil');
var AuthUtil = require('../utils/Auth');

var Auth = new Termoil;

Auth.name('JIRA - Authentication Workflow');
Auth.instructions('jtools [options] auth [options]');
Auth.addVersion(new Termoil.Version('1.0', true));
Auth.addOption(new Termoil.Option(['-i', '-I', '--interactive'], 'isInteractive', new Termoil.Option.Type('flag'), 'Run interactive authentication'));



Auth.on('parsed', function(){
	if( this.get('isInteractive') ){
		AuthUtil.interactive().then(function(success){
			if( success ){
				process.stdout.write('Authentication Complete!\n');
			}else{
				process.stdout.write('Authenticateion Failed!\n');
			}
		});
	}
});


module.exports = Auth;
