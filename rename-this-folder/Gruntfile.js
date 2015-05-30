'use strict';

module.exports = function( grunt ) 
{
	var _destFolder = 'dest/';
	var _developFolder = 'app/';
	var _sizesArrayCrud = grunt.file.readJSON('size.json');
	var _sizesArrayFinal = [];
	var _copyFiles = [];
	var _campaignName = [];
	var _separatorCampaignName = "-";

	if (_sizesArrayCrud[0][2] == ""){
		_separatorCampaignName = "";
	};

	for (var i = 0; i < _sizesArrayCrud.length; i++) {
		_sizesArrayFinal.push(_destFolder+_sizesArrayCrud[i][2]+"/"+_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+_separatorCampaignName+_sizesArrayCrud[i][2]);
		_campaignName.push(_sizesArrayCrud[i][2]);
	};

	for( i = 0; i < _sizesArrayFinal.length; ++i ) {
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/', 
			src: [_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+_separatorCampaignName+_sizesArrayCrud[i][2]+'.js'],
			dest: _sizesArrayFinal[i]+ '/js/',
      		filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/', 
			src: [_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+_separatorCampaignName+_sizesArrayCrud[i][2]+'.css'],
			dest: _sizesArrayFinal[i] + '/css/', 
      		filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp', 
			src: ['**/*.{png,jpg,gif,svg}'],
			dest: _sizesArrayFinal[i]+'/img/',
			filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder, 
			src: ['*.html'],
			dest: _sizesArrayFinal[i]+'/',
			filter: 'isFile'
		});
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mkdir: {
			all: {
				options: {
					create: _sizesArrayFinal
				}
			}
		},
		copy: {
			main: {
				files: _copyFiles
			}
		},
		clean: {
			all: [_destFolder],
  			temp: [_developFolder+'.temp/']
  		},
		sass: {
		    dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none'
				},
		      	files: [{
		        	expand: true,
		        	cwd: _developFolder+'sass/',
			        src: ['*.scss'],
			        dest: _developFolder+'.temp/',
			        ext: '.css'
		      	}]
		    }
		},
		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: _developFolder+'img/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: _developFolder+'.temp/'
				}]
			}
		},
		uglify: {
			my_target: {
				files: [{
					expand: true,
					cwd: _developFolder+'.temp/',
					src: ['*.js'],
					dest: _developFolder+'.temp/'
				}]
			}
		},
		watch: {
			options: { livereload: true },
			files: [_developFolder+'/**'],
			tasks: ['clean:all','sass','includes:js','uglify','imagemin','copy','replace','string-replace','clean:temp']
		},
		replace: {
			dist: {
				options: {
				},
				files: [{
					expand: true,
					src: ['dest/**/**/*.html'],
					dest: ''
				}]
			}
		},
		zip_directories: {
			irep: {
				files: [{
					filter: 'isDirectory',
					expand: true,
					cwd: _destFolder+'*',
					src: ['*'],
					dest: _destFolder+'zipped/'
				}]
			}
		},
		connect: {
		  server: {
		    options: {
		      livereload: true,
		      base: 'dest',
		      port: 9009,
		      open: true
		    }
		  }
		},
		'string-replace': {
			dist: {
				files: {
					'dest/': 'dest/**/**/*.html',
				},
				options: {
					replacements: [{
						pattern: /dest\/(?:(\w+)+\/)?/g,
						replacement: ''
					}]
				}
			}
		},
		includes: {
			js: {
				options: {
					includeRegexp: /^\/\/\s*import\s+['"]?([^'"]+)['"]?\s*$/,
					duplicates: false,
					debug: true
				},
				files: [{
					cwd: _developFolder+'js/',
					src: ['*.js'],
					dest: _developFolder+'.temp/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-zip-directories');
	grunt.loadNpmTasks('grunt-includes');

	grunt.registerTask('serve', [
		'connect:server',
		'watch'
	]);

	grunt.registerTask('default', [
		'clean:all',
		'mkdir',
		'sass',
		'includes:js',
		'uglify',
		'imagemin',
		'copy',
		'replace',
		'string-replace',
		'clean:temp'
	]);

	grunt.registerTask('compress', [
		'zip_directories'
	]);

	grunt.task.registerTask('start', 'Write initial files', function(arg1, arg2) {
		var sassFolder = _developFolder+'sass/';
		var jsFolder = _developFolder+'js/';

		grunt.file.write(_developFolder+'index.html', '<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8">\n\t\t<title>@@__SOURCE_PATH__</title>\n\t\t<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">\n\t\t<link rel="stylesheet" href="css/@@__SOURCE_PATH__.css">\n\t</head>\n\t<body>\n\n\t\t<div class="banner" id="banner">\n\t\t\t<div id="collapse-banner">\n\t\t\t\t<h1>Headline Example</h1>\n\t\t\t\t<h2>Small headline</h2>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<script src="http://s0.2mdn.net/ads/studio/Enabler.js"></script>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.13.2/TweenMax.min.js"></script>\n\t\t<script src="https://cdn.jsdelivr.net/cutback-js/2.4.0/cutback.min.js"></script>\n\t\t<script src="js/@@__SOURCE_PATH__.js"></script>\n\t</body>\n</html>');
		grunt.file.write(sassFolder+'variables.scss', '//Sass variables goes here');
		grunt.file.mkdir(_developFolder+'img/');

		for( i = 0; i < _sizesArrayCrud.length; ++i ) {
			grunt.file.write(sassFolder+_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+_separatorCampaignName+_sizesArrayCrud[i][2]+'.scss', "//Sass code goes here \n @import 'variables';");
			grunt.file.write(jsFolder+_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+_separatorCampaignName+_sizesArrayCrud[i][2]+'.js', '//JS code goes here');
		}
	});
};