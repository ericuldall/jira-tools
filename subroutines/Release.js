var moment = require('moment');
var Termoil = require('termoil');
var Jira = require('../utils/Jira');

var Release = new Termoil;

Release.name('JIRA - Release Manager');
Release.instructions('jtools [options] release [options]');
Release.addVersion(new Termoil.Version('1.0', true));


var ReleaseGet = new Termoil;
ReleaseGet.name('JIRA - Release Manager - Get');
ReleaseGet.instructions('jtools [options] release [options] get [options]');
ReleaseGet.addVersion(new Termoil.Version('1.0', true));
ReleaseGet.addOption(new Termoil.Option(['-n', '-N', '--name'], 'releaseName', new Termoil.Option.Type('value', true, true), 'Release Name(s)', '', filterReleaseNames));
ReleaseGet.addOption(new Termoil.Option(['--all'], 'allReleases', new Termoil.Option.Type('value'), 'Flag to show all releases', true));

ReleaseGet.on('parsed', function(){
	var allReleases = this.get('allReleases');
	var releaseName = this.get('releaseName');
	getReleases(this.get('project'), allReleases, releaseName, function(json){
		process.stdout.write(JSON.stringify(json));
	});
});

var ReleaseCreate = new Termoil;
ReleaseCreate.name('JIRA - Release Manager - Create');
ReleaseCreate.instructions('jtools [options] release [options] create [options]');
ReleaseCreate.addVersion(new Termoil.Version('1.0', true));
ReleaseCreate.addOption(new Termoil.Option(['-b', '-B', '--body'], 'releaseBody', new Termoil.Option.Type('value', true), 'Release Post Body', {}, JSON.parse));

ReleaseCreate.on('parsed', function(){
	var postBody = this.get('releaseBody');
	createRelease(this.get('project'), postBody, function(json){
		process.stdout.write(JSON.stringify(json));
	});
});

var ReleaseRollWeekly = new Termoil;
ReleaseRollWeekly.name('JIRA - Release Manager - Roll Weekly');
ReleaseRollWeekly.instructions('jtools [options] release [options] create [options]');
ReleaseRollWeekly.addVersion(new Termoil.Version('1.0', true));
ReleaseRollWeekly.addOption(new Termoil.Option(['-n', '-N', '--name'], 'releaseName', new Termoil.Option.Type('value', true, true), 'Release Name(s)', '', filterReleaseNames));
ReleaseRollWeekly.addOption(new Termoil.Option(['--start-date'], 'startDate', new Termoil.Option.Type('value', true), 'Start Date of Previous Versions (YYYYMMDD)'));

ReleaseRollWeekly.on('parsed', function(){
	var updates = [];
	var creates = [];
	var project = this.get('project');
	var releaseNames = this.get('releaseName').map(n => n + ' ' + this.get('startDate'));
	var complete = 0.0;
	getReleases(project, false, releaseNames, function(json){
		var l = json.length;
		for(var i=0; i<l; i++){
			var release_id = json[i].id;
			var release_name = json[i].name.split(" ");
			var release_start= release_name.pop();
			var release_next_start = moment(release_start, "YYYYMMDD").add({days: 7});
					release_name = release_name.join(" ") + " " + release_next_start.format("YYYYMMDD");
			(function(release_id, release_name, release_start, release_next_start){
				createRelease(project, {
					name: release_name,
					releaseDate: release_next_start.add({days: 4}).format("YYYY-MM-DD")
				}, function(json){
					creates.push(json);
					updateRelease(release_id, {released: true, moveUnfixedIssuesTo: json.id}, function(json){
						updates.push(json);
						complete += 1;
						if( complete == l ){
							process.stdout.write("CREATED:\n");
							process.stdout.write(JSON.stringify(creates));
							process.stdout.write("\n\n");
							process.stdout.write("UPDATED:\n");
							process.stdout.write(JSON.stringify(updates));
						}
					});
				});
			})(release_id, release_name, release_start, release_next_start);
		}
	});
});


Release.addSubRoutine(new Termoil.SubRoutine(['get'], 'get', ReleaseGet));
Release.addSubRoutine(new Termoil.SubRoutine(['create'], 'create', ReleaseCreate));
Release.addSubRoutine(new Termoil.SubRoutine(['roll-weekly'], 'roll-weekly', ReleaseRollWeekly));

module.exports = Release;

function getReleases(project, allReleases, releaseNames, cb){
	var versions = [];
	Jira.getVersions(project, function(json){
		if( allReleases === true ){
			versions = json;
		}else{
			for(var i=0; i<json.length; i++){
				if( releaseNames.indexOf(json[i].name.toLowerCase()) > -1 ){
					versions.push(json[i]);
				}
			}
		}
		cb(versions);
	});
}

function createRelease(project, postBody, cb){
	postBody.project = project;
	Jira.createVersion(postBody, cb);
}

function updateRelease(id, postBody, cb){
	Jira.updateVersion(id, postBody, cb);
}

function filterReleaseNames(v){
	if( v.constructor !== Array ){
		var val = new Array(v);
	}else{
		var val = v;
	}

	return v.map(vv => vv.toLowerCase());
}
