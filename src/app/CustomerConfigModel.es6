define( [ 'backbone', 'json!./config.json', 'moment' ],
	( Backbone, config, moment ) => {

		// Validate expected configuration data is available
		assert( _.isObject( config ) && _.isObject( config.acr ) && _.isObject( config.acr.endpoints ), 'ERROR: configuration parameters invalid in SystemAdminDesktop' );


		/**
		 * Model to hold customer data
		 * @public
		 */
		class CustomerConfigModel extends Backbone.Model {

			defaults() {
				return {
					original_config_date: moment().format( 'MM-DD-YY HH:YY' ),
					original_update_date: moment().format( 'MM-DD-YY HH:YY' ),
					owner: 'New Owner',
					softwareOptions: [
						{ name: 'byte0_bit1', value: "N" }, { name: 'byte0_bit2', value: "N" }, { name: 'byte0_bit3', value: "N" }, { name: 'byte0_bit4', value: "N" }, { name: 'byte0_bit5', value: "N" }, { name: 'byte0_bit6', value: "N" }, { name: 'byte0_bit7', value: "N" }, { name: 'byte0_bit8', value: "N" },
						{ name: 'byte1_bit1', value: "N" }, { name: 'byte1_bit2', value: "N" }, { name: 'byte1_bit3', value: "N" }, { name: 'byte1_bit4', value: "N" }, { name: 'byte1_bit5', value: "N" }, { name: 'byte1_bit6', value: "N" }, { name: 'byte1_bit7', value: "N" }, { name: 'byte1_bit8', value: "N" },
						{ name: 'byte2_bit1', value: "N" }, { name: 'byte2_bit2', value: "N" }, { name: 'byte2_bit3', value: "N" }, { name: 'byte2_bit4', value: "N" }, { name: 'byte2_bit5', value: "N" }, { name: 'byte2_bit6', value: "N" }, { name: 'byte2_bit7', value: "N" }, { name: 'byte2_bit8', value: "N" },
						{ name: 'byte3_bit1', value: "N" }, { name: 'byte3_bit2', value: "N" }, { name: 'byte3_bit3', value: "N" }, { name: 'byte3_bit4', value: "N" }, { name: 'byte3_bit5', value: "N" }, { name: 'byte3_bit6', value: "N" }, { name: 'byte3_bit7', value: "N" }, { name: 'byte3_bit8', value: "N" },
						{ name: 'byte4_bit1', value: "N" }, { name: 'byte4_bit2', value: "N" }, { name: 'byte4_bit3', value: "N" }, { name: 'byte4_bit4', value: "N" }, { name: 'byte4_bit5', value: "N" }, { name: 'byte4_bit6', value: "N" }, { name: 'byte4_bit7', value: "N" }, { name: 'byte4_bit8', value: "N" },
						{ name: 'byte5_bit1', value: "N" }, { name: 'byte5_bit2', value: "N" }, { name: 'byte5_bit3', value: "N" }, { name: 'byte5_bit4', value: "N" }, { name: 'byte5_bit5', value: "N" }, { name: 'byte5_bit6', value: "N" }, { name: 'byte5_bit7', value: "N" }, { name: 'byte5_bit8', value: "N" },
						{ name: 'byte6_bit1', value: "N" }, { name: 'byte6_bit2', value: "N" }, { name: 'byte6_bit3', value: "N" }, { name: 'byte6_bit4', value: "N" }, { name: 'byte6_bit5', value: "N" }, { name: 'byte6_bit6', value: "N" }, { name: 'byte6_bit7', value: "N" }, { name: 'byte6_bit8', value: "N" },
						{ name: 'byte7_bit1', value: "N" }, { name: 'byte7_bit2', value: "N" }, { name: 'byte7_bit3', value: "N" }, { name: 'byte7_bit4', value: "N" }, { name: 'byte7_bit5', value: "N" }, { name: 'byte7_bit6', value: "N" }, { name: 'byte7_bit7', value: "N" }, { name: 'byte7_bit8', value: "N" },
						{ name: 'byte8_bit1', value: "N" }, { name: 'byte8_bit2', value: "N" }, { name: 'byte8_bit3', value: "N" }, { name: 'byte8_bit4', value: "N" }, { name: 'byte8_bit5', value: "N" }, { name: 'byte8_bit6', value: "N" }, { name: 'byte8_bit7', value: "N" }, { name: 'byte8_bit8', value: "N" },
						{ name: 'byte9_bit1', value: "N" }, { name: 'byte9_bit2', value: "N" }, { name: 'byte9_bit3', value: "N" }, { name: 'byte9_bit4', value: "N" }, { name: 'byte9_bit5', value: "N" }, { name: 'byte9_bit6', value: "N" }, { name: 'byte9_bit7', value: "N" }, { name: 'byte9_bit8', value: "N" }
					],
					system_version: 'missing',
					sw_serial_number: null,
					userUpdated: null,
					visible: true
				};
			}

			/**
			 * Important to set the idAttribute and url for these models
			 * @constructor
			 * @public
			 */
			constructor( args ) {
				super( args );
				this.idAttribute = 'sw_serial_number';
				this.urlRoot = config.acr.endpoints.configurationData;
			}

			/**
			 * No need to implement the constructor for a Backbone view
			 * @constructor
			 * @public
			 */
			initialize( attrs ) {

				// Create an array of byte/bit values for ease of rendering later
				_( attrs ).map( ( value, key ) => {
					if ( key.startsWith( 'byte' ) ) {
						this.attributes.softwareOptions.push( { name: key, value: value } );
						this.unset( key, { silent: true } );

						// Ensure model does not appear to have been changed
						// by the user
						this.changed = {};
					}
				} );
			}

			/**
		 	 * Override the default parse to handle data after a save.  The updated model is returned in an array of 1.
			 * @public
			 */
			parse( data ) {
				return data.rows[0];
			}

			/**
		 	 * Override the default JSON converter to return software options to a flat structure
			 * @public
			 */
			toJSON() {
				let defaultJson = Backbone.Model.prototype.toJSON.call( this );

				for ( let option of defaultJson.softwareOptions ){
					defaultJson[option.name] = option.value;
				}

				delete defaultJson.softwareOptions;
				delete defaultJson.userUpdated;
				delete defaultJson.visible;

				return defaultJson;
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return CustomerConfigModel;
	} );