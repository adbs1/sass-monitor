## Summary

sass_monitor is a wrapper for the node_sass module add the functionality to compile named directories of SASS files.

It can be run standalone or as a Grunt task.

Be sure to run $ npm install before use.

## Grunt usage

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		sassMonitor: {
			staticBuild: {
				srcDir: 'css_src',
				destDir: 'WebContent/static/css',
				includePaths: ['environments/static/','css_src/'],
				debug: true
			},
			production: {
				srcDir: 'css_src',
				destDir: '../GamesWorkshop/Production/gw.war/static/css',
				includePaths: ['environments/prod/','css_src/'],
				debug: true
			},
		},
		watch: {
			css: {
				files: '../css_src/**/*.scss',
				tasks: 'sassMonitor'
			}
		}
	});

	grunt.loadNpmTasks('sassMonitor');

	// Default task.
	grunt.registerTask('default', 'watch');
};

NOTE: Partial imports are relative to the grunt installation folder so for the above example it would be @import '../css_src/common';

## Standalone

node sassMonitor.js

NOTE: As above the imports will be relative ..