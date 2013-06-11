## Summary

sass-monitor is a wrapper for the node_sass module adding the functionality to compile named directories of SASS files.

It can be run standalone or as a Grunt task.

Be sure to run $ npm install before use.

## Testing

1) In the root of the package run:
	
	$ node sass-monitor
2) Edit the ./test/css_src/test.scss file
3) You should now see:

	a) A log entry in the terminal: 'File changed : test/css_src/test.scss'
	b) The ./test/css_output/test.css file with your compiled changes.


## Standalone

1) Edit config.js to suit path requirements.
2) At the command prompt run:

	$ node sassMonitor

NOTE: As above the imports will be relative ..


## Grunt usage

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		sassMonitor: {
			staticBuild: {
				srcDir: 'css_src',
				destDir: '../developmentPath/static/css',
				includePaths: ['environments/static/','css_src/'],
				debug: true
			},
			production: {
				srcDir: 'css_src',
				destDir: '../productionPath/static/css',
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

	grunt.loadNpmTasks('sass-monitor');

	// Default task.
	grunt.registerTask('default', 'watch');
};

NOTE: Partial imports are relative to the grunt installation folder so for the above example it would be @import '../css_src/common';
