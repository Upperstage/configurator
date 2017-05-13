define( [ 'jquery', 'underscore', 'backbone', 'AqlService', 'CustomerConfigModel', 'CustomerConfigReadOnlyView', 'CustomerConfigEditorView', 'SearchCustomerComponent' ],
	( $, _, Backbone, AqlService, CustomerConfigModel, CustomerConfigReadOnlyView, CustomerConfigEditorView, SearchCustomerComponent ) => {


		let CustomerCollectionClass = Backbone.Collection.extend( {
			model: CustomerConfigModel
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

				let customerCollection = null;
				let customerEditView = null;

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

				return new Promise( function( resolve, reject ) {

					// Load data from AQL
					const configService = new AqlService();
					configService.getAllCustomers().then( configData => {

						// Expect JSON to have an attribute named rows
						_( configData.rows ).each( json => {

							// Create a new model from the J.bind(this)SON
							customerCollection.add( new CustomerConfigModel( json ) );
						} );

						resolve( customerCollection );
					} );
				} );
			}
		}

		// RequireJS insists something be returned - in this case, the class.
		return SystemAdminDesktop;
	} );