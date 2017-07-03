module.exports = function( grunt ){

	var watchedFiles = [ 'src/**/*.es6', 'src/**/*.html', 'src/**/*.less' ],
		buildDir = 'dist',
        deployDir = process.env['CONFIGURATOR_ROOT'];

	grunt.initConfig({

		babel: {
			compile: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.es6' ],
					dest: buildDir,
					ext: '.js'
				}]
			}
		},

        clean: {
		    deploy: [deployDir],
            build: [buildDir]
        },

		copy: {
		    deploy: {
		        files: [
                    { expand: true, cwd: buildDir, src: '**/*', dest: deployDir }
                ]
            },
			html: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.html', '**/*.json', '**/*.png' ],
					dest: buildDir
				}]
			},
			vendor: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ 'vendor/**/*.*' ],
					dest: buildDir
				}]
			}
		},

		less: {
			compile: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.less' ],
					dest: buildDir,
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

	grunt.registerTask( 'default', [ 'build' ]);
	grunt.registerTask( 'build', [ 'clean:build', 'babel', 'less', 'copy:html', 'copy:vendor' ]);
	grunt.registerTask( 'deploy', [ 'build', 'clean:deploy', 'copy:deploy' ]);
};