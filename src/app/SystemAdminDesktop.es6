define( [ 'jquery', 'underscore', 'backbone', 'json!./config.json', 'CustomerConfigModel', 'CustomerConfigReadOnlyView', 'CustomerConfigEditorView', 'SearchCustomerComponent' ],
	( $, _, Backbone, config, CustomerConfigModel, CustomerConfigReadOnlyView, CustomerConfigEditorView, SearchCustomerComponent ) => {

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
					customerEditView = null;

				this.getCustomerData().then( function( collection ) {

					customerCollection = collection;

					let searchComponentEl = $( '<div class="search-component-wrapper">' )
						.prependTo( $( '.tabular-results-wrapper' ) );
					new SearchCustomerComponent( searchComponentEl, customerCollection );

					customerCollection.each( function( model ) {

						// Each view draws itself into a separate container
						const elemForView = $( '<div>' );
						$( '.tabular-results' ).append( elemForView );

						new CustomerConfigReadOnlyView( {
							el: elemForView,
							model: model
						} ).on( {
							userRequestedShow: this.userRequestedShow
						} );
					}.bind( this ) );

					// Hide loading banner
					$('.loading-container').hide();

				}.bind( this ) );


				/**
				 * Handle the user's request to show customer config data
				 * @private
				 */
				this.userRequestedShow = function() {
					customerEditView = new CustomerConfigEditorView( {
						el: '.data-entry-form-wrapper',
						model: this.model
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
					customerCollection.fetch()
						.done( () => resolve( customerCollection ) );
				} );
			}
		}

		// RequireJS insists something be returned - in this case, the class.
		return SystemAdminDesktop;
	} );