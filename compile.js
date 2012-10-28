var sass = require('node-sass'),
	watch = require('watch'),
	finder = require('findit'),
	fs = require('fs'),
	basename = require('path').basename,
	dirname = require('path').dirname,
	mkdirp = require('mkdirp'),
	EventEmitter = require('events').EventEmitter,
	path = require('path'),
	bDebug = true;

var em = new EventEmitter;
function compileDirectory(srcDir, destDir) {

	var files = require('findit').findSync(srcDir);
	debug("files", files);
	em.setMaxListeners(files.length);
	for ( var int = 0; int < files.length; int++) {
		var isLast = (int+1) == files.length;
		compile(files[int], srcDir, destDir, isLast);
		em.once("exit", function(){
			setTimeout(process.exit, 500);
		});
	}
	
}

function compile(srcPath, srcDir, destDir, endProcessFlag) {
	if(path.extname(srcPath) == '.scss') {

		var srcFileName = srcPath.split(srcDir)[1];
		var outputPath = destDir + srcFileName.replace('.scss', '.css');

		fs.stat(srcPath, function(err, stats){

			if(stats.isFile() && srcFileName.indexOf("_") != 1) {

				debug('read', srcPath);

				fs.readFile(srcPath, 'utf8', function(err, str) {
					if (err) {
						debug("error 1", srcPath);
						console.log(err);
						return;
					}
					sass.render(str, function(err, css) {
						if (err) {
							debug("error 2", srcPath);
							console.log(srcPath);
							console.log(err);
							return;
						}
						mkdirp(dirname(outputPath), 0700, function(err) {
							if (err) {
								debug("error 3", outputPath);
								console.log(err);
								return;
							}
							fs.writeFile(outputPath, css, 'utf8', function(err){
								if (err) {
									debug("error 4", outputPath);
									console.log(err);
									return;
								} else {
									debug('write', outputPath);
								}
								if(endProcessFlag) {
									em.emit("exit");
								}
							});
						});
					}, { include_paths: [ 'lib/', 'mod/' ], output_style: 'compressed' });
				});
			}
		});
	}
}
function debug(key, val) {
	if(bDebug) {
		console.error('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, val);
	}
}
function log(key, val) {
	console.error('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, val);
}
process.on('message', function(data) {
	bDebug = data.debug;
	debug("data.srcDir", data.srcDir);
	debug("data.destDir", data.destDir);
	compileDirectory(data.srcDir, data.destDir);
});
