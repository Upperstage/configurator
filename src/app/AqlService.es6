define( [ 'jquery', 'underscore', 'json!./config.json', 'json!./sample_payload.json' ],
	( $, _, config, DummyPayload ) => {

		// Validate expected configuration data is available
		assert( _.isObject( config ) && _.isObject( config.acr ) && _.isObject( config.acr.endpoints ), 'ERROR: configuration parameters invalid in AqlService' );


		/**
		 * Manages interface to AQL
		 * @public
		 */
		class AqlService {

			/**
			 * The constructor is a noop
			 * @public
			 * @constructor
			 */
			constructor() {}

			/**
			 * Get something - not sure what
			 * @public
			 */
			getAllCustomers() {

				if ( config.acr.useCannedData == "true" )
					return Promise.resolve( DummyPayload );

				// Rather simple approach at this point, but load the configuration data here
				return new Promise( function( resolve, reject ) {
					$.ajax( {
							type: 'GET',
							url: config.acr.endpoints.configurationData,
							headers: {
								'Access-Control-Allow-Origin': '*'
							}
						} )
						.done( resolve )
						.fail( reject );
				} );
			}
		}

		// RequireJS insists something be returned - in this case, the class.
		return AqlService;
	} );