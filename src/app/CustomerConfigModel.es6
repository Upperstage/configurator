define( [ 'backbone' ],
	( Backbone ) => {

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
						this.unset( key, {
							silent: true
						} );
					}
				} );
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return CustomerConfigModel;
	} );