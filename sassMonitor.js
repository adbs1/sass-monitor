var sassMonitor = require("./config");

var sass = require('node-sass'),
	watch = require('watch'),
	finder = require('findit'),
	fs = require('fs'),
	basename = require('path').basename,
	dirname = require('path').dirname;

watch.createMonitor(sassMonitor.data.srcDir,
	function(monitor) {
		log("monitor", "created");
		monitor.files['./[!_.*].scss'];

		monitor.on("created", function(f) {
			log("File created", f);
			compileAll(f);
		});
		monitor.on("changed", function(f, curr, prev) {
			log("File changed", f);
			compileAll();
		});
		monitor.on("removed", function(f, stat) {
			log("scss src remove, you need to manually remove", f);
		});
	}
);

function compileAll() {
	var fork = require('child_process').fork(__dirname+'/compile.js', function(){
		debug("compile.js completed for pid", fork.pid);
	});
	fork.send({srcDir: sassMonitor.data.srcDir, destDir: sassMonitor.data.destDir, debug: sassMonitor.data.debug, includePathsArray: sassMonitor.data.includesPath});
	fork.on('exit', function (code) {
		debug("exit detected so killing process", fork.pid);
		fork.kill();
	});
}

function debug(key, val) {
	if(bDebug) {
		console.error('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, val);
	}
}
function debug(val) {
	if(sassMonitor.data.debug) {
		console.error('  \033[90m%s :\033[0m \033[36m%s\033[0m', val);
	}
}
function log(key, val) {
	console.error('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, val);
}