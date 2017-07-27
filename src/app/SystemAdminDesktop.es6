define( [ 'jquery', 'underscore', 'backbone', 'json!./config.json', 'CustomerConfigModel', 'CustomerConfigReadOnlyView', 'CustomerConfigEditorView', 'SearchCustomerComponent', 'CustomerConfigEditorButtons' ],
	( $, _, Backbone, config, CustomerConfigModel, CustomerConfigReadOnlyView, CustomerConfigEditorView, SearchCustomerComponent, CustomerConfigEditorButtons ) => {

		// Validate expected configuration data is available
		assert( _.isObject( config ) && _.isObject( config.acr ) && _.isObject( config.acr.endpoints ), 'ERROR: configuration parameters invalid in SystemAdminDesktop' );


		let CustomerCollectionClass = Backbone.Collection.extend( {
			model: CustomerConfigModel,
			parse: json => json.rows,
			url: config.acr.endpoints.configurationData
		} );


		/**
		 * Simple class to manage the user desktop
		 * @public
		 */
		class SystemAdminDesktop {

			/**
			 * The constructor loads the HTML expected by an instance of this class.
			 * @public
			 * @constructor
			 */
			constructor() {

				let customerCollection = null,
					customerEditView = null,
					buttonView = null;

				this.getCustomerData().then(

					function( collection ) {
						customerCollection = collection;

						let searchComponentEl = $( '<div class="search-component-wrapper">' )
							.prependTo( $( '.tabular-results-wrapper' ) );
						new SearchCustomerComponent( searchComponentEl, customerCollection );

						// Create the read only view for each model
						customerCollection.each( customerModelAdded );
						customerCollection.on( 'add',  model => { debugger; /*customerModelAdded( model ); userRequestedShow( model ); */ }  );

						// Create node for buttons
						$( '.footer-content' ).html( $( '<div class="buttons-wrapper">' ) );

						buttonView = new CustomerConfigEditorButtons( { el: $( '.buttons-wrapper' ), collection: customerCollection } );

						// Hide loading banner
						$('.loading-container').hide();

					}.bind( this ),
					reject => $('.loading-container').hide()
				);

				/**
				 * Render a read-only view of the model
				 * @private
				 */
				function customerModelAdded( model ) {

					// Each view draws itself into a separate container
					const elemForView = $( '<div>' );
					$( '.tabular-results' ).prepend( elemForView );

					new CustomerConfigReadOnlyView( { el: elemForView, model: model } )
						.on( {userRequestedShow: userRequestedShow } );
				}

				/**
				 * Handle the user's request to show customer config data
				 * @private
				 */
				function userRequestedShow( model ) {
					customerEditView = new CustomerConfigEditorView( {
						el: '.data-entry-form-wrapper',
						model: model
					} );
				}
			}

			/**
			 * Get all customer data from server; eventually return a Backbone collection
			 * @public
			 * @returns { Promise }
			 */
			getCustomerData() {

				let customerCollection = new CustomerCollectionClass();

				// Load data from AQL
				return new Promise( function( resolve, reject ) {
					customerCollection.fetch({
						replace: true,
						error: ( coll, xhr ) => {
							Messenger().error( `Error connecting to AQL: ${xhr.responseText}` );
							reject();
						}
					})
					.done( () => {
						Messenger().info( `Configurator retrieved ${customerCollection.length} customer records from AQL` );
						resolve( customerCollection );
					})
				} );
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return SystemAdminDesktop;
	} );