module.exports = function( grunt ){

    const rootKey = 'CONFIGURATOR_ROOT';

    if( !process.env[rootKey] )
        throw new Error( 'Environment variable \'${rootKey}\' does not exist or does not have a value. Please create it and set the value to the root of the public folder in the configurator server.' );

	const watchedFiles = [ 'src/**/*.es6', 'src/**/*.html', 'src/**/*.less' ],
		buildDir = 'dist',
        deployDir = process.env[rootKey];


	grunt.initConfig({

		babel: {
			build: {
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
		    deploy: {
		        files: deployDir,
                options: { force: true }
            },
            build: [ buildDir ]
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
			deploy: {
				files: watchedFiles,
				tasks: [ 'newer:clean:build', 'newer:babel', 'newer:less', 'newer:copy:html', 'newer:copy:vendor', 'newer:copy:deploy' ],
                options: { spawn: false }
			}
		}
	});

	// Tell grunt which plug-ins to load.
	grunt.loadNpmTasks( 'grunt-babel' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-newer' );

	grunt.registerTask( 'default', [ 'deploy' ]);
	grunt.registerTask( 'build', [ 'clean:build', 'babel', 'less', 'copy:html', 'copy:vendor' ]);
	grunt.registerTask( 'deploy', [ 'build', 'clean:deploy', 'copy:deploy' ]);
};