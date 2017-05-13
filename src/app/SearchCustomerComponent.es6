define( [ 'jquery', 'underscore', 'backbone' ],
	( $, _, Backbone ) => {

		/**
		 * Simple class to provide a search
		 * @public
		 */
		class SearchCustomerComponent {

			/**
			 * The constructor loads the HTML expected by an instance of this class.
			 * @public
			 * @constructor
			 */
			constructor( el, collection ) {

				// Validate expected parameters
				assert( arguments.length === 2, 'ERROR: invalid number of parameters in SearchCustomerComponent constructor' );
				assert( _.isObject( collection ), 'ERROR: invalid parameters SearchCustomerComponent constructor' );

				let inputEl = $( '<input>' ).attr( {
					class: 'search-component form-control',
					placeholder: 'Filter customers',
					type: 'string'
				} );

				let searchIcon = $( '<i>' ).attr( {
					class: 'fa fa-search',
					'aria-hidden': 'true'
				} );

				$( el ).append( inputEl ).append( searchIcon );

				/**
				 * handle the user request to filter
				 * @private
				 */
				let handleSearch = function() {
					const textToSearch = inputEl.val();
					collection.each( ( model ) => {
						const matchesName = model.get( 'owner' ).includes( textToSearch );
						const matchesSerialNumber = model.get( 'serial_number' ) == textToSearch;
						model.set( 'visible', matchesName || matchesSerialNumber );
					} );
				}

				// Hanld the enter key or click on search icon
				searchIcon.click( handleSearch );
				inputEl.keyup( event => {
					if ( event.keyCode == 13 ) handleSearch();
				} );
			}
		}

		// RequireJS insists something be returned - in this case, the class.
		return SearchCustomerComponent;
	} );