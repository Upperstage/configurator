module.exports = function( grunt ){

	var watchedFiles = [ 'src/**/*.es6', 'src/**/*.html', 'src/**/*.less' ],
		deployDir = 'dist';

	grunt.initConfig({

		babel: {
			compile: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.es6' ],
					dest: deployDir,
					ext: '.js'
				}]
			}
		},

		copy: {
			html: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.html', '**/*.json', '**/*.png' ],
					dest: deployDir
				}]
			},
			vendor: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ 'vendor/**/*.*' ],
					dest: deployDir
				}]
			}
		},

		less: {
			compile: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.less' ],
					dest: deployDir,
					ext: '.css'
				}]
			}
		},

		watch: {
			src: {
				files: watchedFiles,
				tasks: [ 'babel', 'less', 'copy:html', 'copy:vendor' ]
			}
		}
	});

	// Tell grunt which plug-ins to load.
	grunt.loadNpmTasks( 'grunt-babel' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.registerTask( 'default', [ 'watch' ]);
}