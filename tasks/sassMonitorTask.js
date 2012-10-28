module.exports = function(grunt) {
	'use strict';

	grunt.registerMultiTask('sassMonitor', 'Compile SCSS to CSS', function() {
		var sassMonitor = this;
		var bDebug = (typeof sassMonitor.data.debug !== undefined)? sassMonitor.data.debug : false;

		function compileAll() {
			var fork = require('child_process').fork(__dirname+'/../compile.js', function(){
				debug("compile.js completed for pid", fork.pid);
			});
			fork.send({srcDir: sassMonitor.data.srcDir, destDir: sassMonitor.data.destDir, debug: bDebug});
			fork.on('exit', function (code) {
				debug("exit detected so killing process", fork.pid);
				fork.kill();
			});
		}

		function debug(key, val) {
			if(bDebug) {
				console.error('  \u001b[90m%s :\u001b[0m \u001b[36m%s\u001b[0m', key, val);
			}
		}
		function debug(val) {
			if(bDebug) {
				console.error('  \u001b[90m%s :\u001b[0m \u001b[36m%s\u001b[0m', val);
			}
		}
		function log(key, val) {
			console.error('  \u001b[90m%s :\u001b[0m \u001b[36m%s\u001b[0m', key, val);
		}

		compileAll();
	});
};