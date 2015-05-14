'use strict';

module.exports = function( grunt ) 
{
	var _destFolder = 'dest/';
	var _developFolder = 'app/';
	var _sizesArrayCrud = grunt.file.readJSON('size.json');
	var _sizesArrayFinal = [];
	var _copyFiles = [];

	for (var i = 0; i < _sizesArrayCrud.length; i++) {
		_sizesArrayFinal.push(_destFolder+_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]); 
	};

	for( i = 0; i < _sizesArrayFinal.length; ++i ) {
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/', 
			src: [_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+'.js'],
			dest: _sizesArrayFinal[i]+ '/js/', 
      		filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/', 
			src: [_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+'.css'],
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
					src: ['**/*.{png,jpg,gif}'],
					dest: _developFolder+'.temp/'
				}]
			}
		},
		uglify: {
			my_target: {
				files: [{
					expand: true,
					cwd: _developFolder+'js/',
					src: ['*.js'],
					dest: _developFolder+'.temp/'
				}]
			}
		},
		watch: {
			options: {
				livereload: true
			},
			files: [_developFolder+'/**'],
			tasks: ['default']
		},
		replace: {
			dist: {
				options: {
				},
				files: [{
					expand: true,
					src: ['**/*.html'],
					dest: ''
				}]
			}
		},
		zip_directories: {
			irep: {
				files: [{
					filter: 'isDirectory',
					expand: true,
					cwd: _destFolder,
					src: ['*'],
					dest: _destFolder+'zipped/'
				}]
			}
		},
		connect: {
			all: {
				options:{
					port: 9000,
					hostname: "0.0.0.0",
					// Prevents Grunt to close just after the task (starting the server) completes
					// This will be removed later as `watch` will take care of that
					//keepalive: true,
					middleware: function(connect, options) {
						return [
							// Load the middleware provided by the livereload plugin
							// that will take care of inserting the snippet
							require('grunt-contrib-livereload/lib/utils').livereloadSnippet,

							// Serve the project folder
							connect.static(options.base)
						];
					}
				}
			}
		},
		open: {
			all: {
				// Gets the port from the connect configuration
				path: 'http://localhost:<%= connect.all.options.port%>'
			}
		},
		regarde: {
			all: {
				// This'll just watch the index.html file, you could add **/*.js or **/*.css
				// to watch Javascript and CSS files too.
				files:['index.html'],
				// This configures the task that will run when the file change
				tasks: ['livereload']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-zip-directories');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', [
		'clean:all',
		'mkdir',
		'sass',
		'uglify',
		'imagemin',
		'copy',
		'replace',
		'clean:temp',
	]);

	grunt.registerTask('compress', [
		'zip_directories'
	]);

	grunt.registerTask('server',[
		'livereload-start',
		'connect',
		'open',
		'regarde'
	]);

	grunt.task.registerTask('start', 'Write initial files', function(arg1, arg2) {
		var sassFolder = _developFolder+'sass/';
		var jsFolder = _developFolder+'js/';

		grunt.file.write(sassFolder+'variables.scss', '//Sass variables goes here');
		grunt.file.mkdir(_developFolder+'img/');

		for( i = 0; i < _sizesArrayCrud.length; ++i ) {
			grunt.file.write(sassFolder+_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+'.scss', "//Sass code goes here \n @import 'variables';");
			grunt.file.write(jsFolder+_sizesArrayCrud[i][0]+"_"+_sizesArrayCrud[i][1]+'.js', '//JS code goes here');
		}
	});
};