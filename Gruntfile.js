module.exports = function( grunt ){

    const rootKey = 'CONFIGURATOR_ROOT';

    if( !process.env[rootKey] )
        throw new Error( 'Environment variable \'${rootKey}\' does not exist or does not have a value. Please create it, and set the value to the public folder in the configurator server.' );

	const watchedFiles = [ 'src/**/*.es6', 'src/**/*.html', 'src/**/*.less' ],
        deployDir = process.env[rootKey];


	grunt.initConfig({

		babel: {
			build: {
				files: [{ expand: true, cwd: 'src', src: [ '**/*.es6' ], dest: deployDir, ext: '.js' }]
			}
		},

        clean: {
		    deploy: { files: deployDir, options: { force: true } }
        },

		copy: {
			html: {
				files: [{ expand: true, cwd: 'src', src: [ '**/*.html', '**/*.json', '**/*.png' ], dest: deployDir }]
			},
			vendor: {
				files: [{ expand: true, cwd: 'src', src: [ 'vendor/**/*.*' ], dest: deployDir }]
			}
		},

		less: {
			compile: {
				files: [{ expand: true, cwd: 'src', src: [ '**/*.less' ], dest: deployDir, ext: '.css'}]
			}
		},

		watch: {
			deploy: {
				files: watchedFiles,
				tasks: [ 'newer:babel', 'newer:less', 'newer:copy:html', 'newer:copy:vendor' ],
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

	grunt.registerTask( 'default', [ 'build' ]);
	grunt.registerTask( 'build', [ 'clean:deploy', 'babel', 'less', 'copy:html', 'copy:vendor' ]);
};