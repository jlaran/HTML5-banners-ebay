//////////////////////////////////////////////////////////////////////////////////////////
///
///  Cutback Gruntfile v3.3
///  A JS Library to easy build Doubleclick Ad Banners
///  Moxie Team
///
///  Contact information: 
///  Juan Lara | skype:juanlaran
///
//////////////////////////////////////////////////////////////////////////////////////////


'use strict';

// _sizesArrayCrud[0] = Initial size
// _sizesArrayCrud[1] = Banner type
// _sizesArrayCrud[2] = Expand size (if expand or not)
// _sizesArrayCrud[3] = Campaign Name


module.exports = function( grunt ) 
{
	var _cutbackVersion = "3.3.0";

	var _destFolder = 'deploy/';
	var _developFolder = 'source/';
	var _sizesArrayCrud = grunt.file.readJSON('size.json');
	var _sizesArrayFinal = [];
	var _copyFiles = [];
	var _campaignName = [];
	var _specificImages = [];
	var _compressFolders = [];

	var _separatorCampaignNameArray = [];
	var _separatorExpandSizeArray = [];
	var _separatorTypeArray = [];

	var _separatorCampaignName = "_";
	var _separatorExpandSize = "_";
	var _separatorType = "_";

	for (var i = 0; i < _sizesArrayCrud.length; i++) {
		if (_sizesArrayCrud[i][3] == ""){
			_separatorCampaignNameArray.push("");
		} else {
			_separatorCampaignNameArray.push(_separatorCampaignName);
		}

		if (_sizesArrayCrud[i][2] == ""){
			_separatorExpandSizeArray.push("");
		} else {
			_separatorExpandSizeArray.push(_separatorExpandSize);
		}

		if (_sizesArrayCrud[i][1] == ""){
			_separatorTypeArray.push("");
		} else {
			_separatorTypeArray.push(_separatorType);
		}

		_sizesArrayFinal.push(_destFolder+_sizesArrayCrud[i][3]+"/"+_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]);
		_campaignName.push(_sizesArrayCrud[i][3]);
	};

	for( i = 0; i < _sizesArrayFinal.length; ++i ) {

		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/', 
			src: [_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]+'.js'],
			dest: _sizesArrayFinal[i]+ '/js/',
      		filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/', 
			src: [_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]+'.css'],
			dest: _sizesArrayFinal[i] + '/css/', 
      		filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp', 
			src: ['*.{png,jpg,gif,svg}'],
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
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/'+_sizesArrayCrud[i][3]+'/', 
			src: ['*.{png,jpg,gif,svg}'],
			dest: _sizesArrayFinal[i]+'/img/',
			filter: 'isFile'
		});
		_copyFiles.push({
			expand: true, 
			cwd: _developFolder+'.temp/backup/', 
			src: [_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]+'.jpg'],
			dest: _sizesArrayFinal[i]+'/img/',
			filter: 'isFile'
		});

		//Specific Images for each folder
		if(_sizesArrayCrud[i][3] != ""){
			_specificImages.push({
				expand: true,
				cwd: _developFolder+'img/'+_sizesArrayCrud[i][3]+'/',
				src: ['*.{png,jpg,gif,svg}'],
				dest: _developFolder+'.temp/'+_sizesArrayCrud[i][3]+'/'
			});
		}

		_specificImages.push({
			expand: true,
			cwd: _developFolder+'img/backup/',
			src: [_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]+'.jpg'],
			dest: _developFolder+'.temp/backup/'
		});

		//Zipped Array
		if(_sizesArrayCrud[i][3] != ""){
			_compressFolders.push({
				filter: 'isDirectory',
				expand: true,
				cwd: _destFolder+_sizesArrayCrud[i][3]+'/',
				src: [_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]],
				dest: _destFolder+'zipped/'
			});
		} else {
			_compressFolders.push({
				filter: 'isDirectory',
				expand: true,
				cwd: _destFolder,
				src: [_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]],
				dest: _destFolder+'zipped/'
			});
		}
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
					src: ['*.{png,jpg,gif,svg}'],
					dest: _developFolder+'.temp/'
				}]
			},
			specific: {
				options: {
					optimizationLevel: 3
				},
				files: _specificImages
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
			tasks: ['clean:all','sass','includes:js','uglify','imagemin:dynamic','imagemin:specific','copy','replace','string-replace','clean:temp']
		},
		replace: {
			dist: {
				options: {
				},
				files: [{
					expand: true,
					src: ['deploy/**/**/*.html'],
					dest: ''
				}]
			}
		},
		zip_directories: {
			irep: {
				files: _compressFolders
			}
		},
		connect: {
		  server: {
		    options: {
		      livereload: true,
		      base: 'deploy',
		      port: 9009,
		      open: true
		    }
		  }
		},
		'string-replace': {
			dist: {
				files: {
					'deploy/': 'deploy/**/**/*.html',
				},
				options: {
					replacements: [{
						pattern: /deploy\/(?:(\w+)+\/)?/g,
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
		},
		fileExists: {
			scripts: _developFolder
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
	grunt.loadNpmTasks('grunt-file-exists');

	grunt.registerTask('fire', [
		'connect:server',
		'watch'
	]);

	grunt.registerTask('default', [
		'clean:all',
		'mkdir',
		'sass',
		'includes:js',
		'uglify',
		'imagemin:dynamic',
		'imagemin:specific',
		'copy',
		'replace',
		'string-replace',
		'clean:temp'
	]);

	grunt.registerTask('compress', [
		'zip_directories'
	]);

	grunt.task.registerTask('start', 'Write initial files', function(arg1, arg2) {
		var startCreated = grunt.file.isDir(_developFolder);

		if(startCreated == false){
			var sassFolder = _developFolder+'sass/';
			var jsFolder = _developFolder+'js/';

			grunt.file.write(_developFolder+'index.html', '<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8">\n\t\t<title>@@__SOURCE_PATH__</title>\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />\n\t\t<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">\n\t\t<link rel="stylesheet" href="css/@@__SOURCE_PATH__.css">\n\t</head>\n\t<body>\n\n\t\t<!-- Start your Banner here -->\n\n\t\t<div class="banner" id="banner">\n\t\t\t<div id="collapse-banner">\n\t\t\t\t<h1>Headline Example</h1>\n\t\t\t\t<h2>Small headline</h2>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- Finish your Banner here -->\n\n\t\t<script src="http://s0.2mdn.net/ads/studio/Enabler.js"></script>\n\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.13.2/TweenMax.min.js"></script>\n\t\t<script src="https://cdn.jsdelivr.net/cutback-js/'+_cutbackVersion+'/cutback.min.js"></script>\n\t\t<script src="js/@@__SOURCE_PATH__.js"></script>\n\n\t\t<!-- <script src="https://cdn.jsdelivr.net/cutback-js/'+_cutbackVersion+'/cutback-stats.min.js"></script> -->\n\n\t</body>\n</html>');
			grunt.file.write(sassFolder+'variables.scss', '//Sass variables goes here\n\n$opacityCero: 0;\n\n//Background Colors\n$BackgroundWhite: #ffffff;\n\n//Border Colors\n$borderGray: #333333;\n\n\n//Mixins\n\n@mixin border-radius($radius) {\n\t-webkit-border-radius: $radius;\n\t-moz-border-radius: $radius;\n\t-ms-border-radius: $radius;\n\tborder-radius: $radius;\n}');
			grunt.file.write(jsFolder+'sharedFunctions.js', '//Shared Functions goes here\n\nvar customFunctions = {\n\n}');
			grunt.file.mkdir(_developFolder+'img/');

			for( i = 0; i < _sizesArrayCrud.length; ++i ) {

				var collapseSize = _sizesArrayCrud[i][0].split("x");
				var expandSize = _sizesArrayCrud[i][2].split("x");

				var sassInitialText = '//Sass code goes here \n @import "variables"; \n\n body {\n\tbackground: $BackgroundWhite;\n}\n\n#banner {\n\twidth: '+ collapseSize[0] +'px;\n\theight: '+ collapseSize[1] +'px;\n}\n\n#collapse-banner {\n\twidth: '+ (collapseSize[0] - 2) +'px;\n\theight: '+ (collapseSize[1] - 2) +'px;\n\tbackground: $BackgroundWhite;\n\toverflow: hidden;\n\tcursor: pointer;\n\tborder: 1px $borderGray solid;\n\tposition: relative;\n}'+ ( (_sizesArrayCrud[i][1] == "expand" || (_sizesArrayCrud[i][2] != "" && _sizesArrayCrud[i][2] != "full"))  ?  "\n\n#expanded-banner {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: "+ (expandSize[0] - 2) +"px;\n\theight: "+ (expandSize[1] - 2) +"px;\n\tbackground: $BackgroundWhite;\n\tdisplay: none;\n\topacity: $opacityCero;\n\toverflow: hidden;\n\tborder: 1px $borderGray solid;\n}" : "") + (_sizesArrayCrud[i][2] == "full"  ?  "\n\n#expanded-banner {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground: $BackgroundWhite;\n\tdisplay: none;\n\topacity: $opacityCero;\n\toverflow: hidden;\n\tborder: 1px $borderGray solid;\n}" : "");

				grunt.file.write(sassFolder+_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]+'.scss', sassInitialText);

				var jsInitialText = '//JS code goes here\n\nvar banner = new Banner({\n\t'+ ( _sizesArrayCrud[i][1] != ""  ?  'bannerType: "' + _sizesArrayCrud[i][1] + '",\n\t' : "" ) + ( _sizesArrayCrud[i][1] == "expand" || (_sizesArrayCrud[i][1] == "in-app" && _sizesArrayCrud[i][2] != "") ?  "expand: true,\n\t" : "" ) + ( _sizesArrayCrud[i][2] != "" && _sizesArrayCrud[i][1] == "expand" ?  "finalExpandSize: [0,0,"+expandSize[0]+","+expandSize[1]+"],\n\t" : "" ) + ( _sizesArrayCrud[i][1] == "expand" ?  '//hotspotClose: [""],\n\t' : "" ) + ( (_sizesArrayCrud[i][2] != "" || _sizesArrayCrud[i][1] == "expand") ?  '//hotspotExpand: [""],\n\t' : "" ) + 'timelinesName: ["firstTimeline"],\n\telementsToRegister: [\n\t\t//{eventType: "click", element: "#identifier", functionToCall: "function"}\n\t],\n\tanimationFrames: [\n\t\tfunction firstFrame(){\n\t\t}\n\t],\n\ttimelinesToRegister: {\n\t\tregister: function(){\n\t\t\tbanner.timelinesArray[0].to("identifier", 0.2, {opacity:1});\n\t\t}'+ ( (_sizesArrayCrud[i][2] != "" || _sizesArrayCrud[i][1] == "expand")  ?  ",\n\t\texpandStartAnimation : function(){\n\t\t},\n\t\tcollapseStartAnimation: function(){\n\t\t}" : "" ) +'\n\t}\n});\n\n//import "sharedFunctions.js"';

				grunt.file.write(jsFolder+_sizesArrayCrud[i][0]+_separatorTypeArray[i]+_sizesArrayCrud[i][1]+_separatorExpandSizeArray[i]+_sizesArrayCrud[i][2]+_separatorCampaignNameArray[i]+_sizesArrayCrud[i][3]+'.js', jsInitialText);
			}
		}else{
			grunt.log.subhead("The source folder is already created!");
		}
	});
};
