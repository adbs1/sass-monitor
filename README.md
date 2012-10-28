## Beware

This is very much a work in progress, it serves the purpose I need and that's as a task in grunt to compile scss within a directory. It's compiled on os-x lion so may not work for others. An npm install should rebuild node sass for other os' .

## Grunt usage

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		sassMonitor: {
			data: {
				srcDir: '../css_src',
				destDir: '../css',
				debug: true
			}
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

NOTE: As above the imports will be relative .. I've edited the libsass files to give better output when your path is wrong.