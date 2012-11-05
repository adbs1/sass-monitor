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
function compileDirectory(srcDir, destDir, includePathsArray) {

	var files = finder.findSync(srcDir);
	var filesLength = files.length;
	debug("files ["+filesLength+"]", files);
	em.setMaxListeners(filesLength);
	for ( var int = 0; int < filesLength; int++) {
		var isLast = (int+1) == filesLength;
		compile(files[int], srcDir, destDir, includePathsArray, isLast);
		em.once("exit", function(){
			setTimeout(process.exit, 500);
		});
	}

}

function compile(srcPath, srcDir, destDir, includePathsArray, endProcessFlag) {
	if(path.extname(srcPath) == '.scss') {
		var srcFileName = srcPath.split(srcDir)[1];
		var outputPath = destDir + srcFileName.replace('.scss', '.css');

		fs.stat(srcPath, function(err, stats){

			if(stats.isFile() && srcFileName.indexOf("_") != 1) {

				debug('read', srcPath);

				fs.readFile(srcPath, 'utf8', function(err, str) {
					if (err) {
						error("ERROR readFile", "["+srcPath+"]"+err);
						return;
					}
					sass.render(str, function(err, css) {
						if (err) {
							error("ERROR sass", "["+srcPath+"]"+err);
							return;
						}
						mkdirp(dirname(outputPath), 0700, function(err) {
							if (err) {
								error("ERROR mkdirp", "["+srcPath+"]"+err);
								return;
							}
							fs.writeFile(outputPath, css, 'utf8', function(err){
								if (err) {
									error("ERROR writeFile", "["+srcPath+"]"+err);
									return;
								} else {
									debug('write', outputPath);
								}
								if(endProcessFlag) {
									em.emit("exit");
								}
							});
						});
					}, { include_paths: includePathsArray/*, output_style: 'compressed'*/ });
				});
			}
		});
	}
}
function debug(key, val) {
	if(bDebug) {
		console.error('  \033[37m%s :\033[0m \033[36m%s\033[0m', key, val);
	}
}
function log(key, val) {
	console.error('  \033[33m%s :\033[0m \033[90m%s\033[0m', key, val);
}
function error(key, val) {
	console.error('  \033[31m%s :\033[0m \033[90m%s\033[0m', key, val);
}
process.on('message', function(data) {
	bDebug = data.debug;
	debug("data.srcDir", data.srcDir);
	debug("data.destDir", data.destDir);
	debug("data.includePathsArray", data.includePathsArray);
	compileDirectory(data.srcDir, data.destDir, data.includePathsArray);
});
