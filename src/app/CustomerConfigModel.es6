define( [ 'backbone', 'json!./config.json' ],
	( Backbone, config ) => {

		// Validate expected configuration data is available
		assert( _.isObject( config ) && _.isObject( config.acr ) && _.isObject( config.acr.endpoints ), 'ERROR: configuration parameters invalid in SystemAdminDesktop' );


		/**
		 * Model to hold customer data
		 * @public
		 */
		class CustomerConfigModel extends Backbone.Model {

			defaults() {
				return {
					softwareOptions: [],
					visible: true
				};
			}

			constructor( args ) {
				super( args );
			}

			initialize( attrs ) {

				// Until backend sends software options as an array, create an array here.
				_( attrs ).map( ( value, key ) => {
					if ( key.startsWith( 'byte' ) ) {
						this.attributes.softwareOptions.push( {
							name: key,
							value: value
						} );
						this.unset( key, { silent: true } );

						// Ensure model does not appear to have been changed
						// by the user
						this.changed = {};
					}
				} );
			}

			url() {
				return config.acr.endpoints.configurationData;
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return CustomerConfigModel;
	} );