define( [ 'underscore', 'backbone', 'mustache', 'json!./config.json', 'text!CustomerEditForm.html' ],
	( _, Backbone, Mustache, config, CustomerFormHtml ) => {

		/**
		 * The Mustache template used to render the view
		 * @private
		 */
		const template = `
		{{# softwareOptions }}
			{{# isUsed }}
			 <div class="onoffswitch-and-label-wrapper" title="{{ name }}" style="order: {{ order }}">
				 <div class="onoffswitch-wrapper" >
					<div class="onoffswitch">
					    <input type="checkbox" class="onoffswitch-checkbox" id="option_{{ name }}" data-name="{{ name }}" {{ isChecked }}>
					    <label class="onoffswitch-label" for="option_{{ name }}">
					        <span class="onoffswitch-inner"></span>
					        <span class="onoffswitch-switch"></span>
					    </label>
					</div>
				</div>
				<div class="option-label">
					{{ label }}
				</div>
			</div>
			{{/ isUsed }}
		{{/ softwareOptions }}`;

		/**
		 * A View is an atomic chunk of user interface. It often renders the data
		 * from a specific model, or number of models — but views can also be data-less
		 * chunks of UI that stand alone.  Models should be generally unaware of views.
		 * Instead, views listen to the model "change" events, and react or re-render
		 * themselves appropriately.
		 * @public
		 */
		class CustomerConfigEditorView extends Backbone.View {

			/**
			 * No need to implement the constructor for a Backbone view
			 * @constructor
			 * @public
			 */
			constructor( args ) {
				super( args );
			}

			/**
			 * Setup handlers for the interesting events thrown by the DOM or the model
			 * and handled by this view.
			 * @public
			 */
			events() {
				return {
					'change input': () => {

						// Update the model based on changes in the view
						const target = $(event.target);
						const attributeName = target.data('name');
						const attributeValue = target[0].checked;

						let options = this.model.get( 'softwareOptions' );
						for ( let option of options ){
							if( option.name === attributeName ){
								option.value = attributeValue ? 'Y' : 'N';

								// Setting options in the array (as above) won't trigger a change event, so ..
								this.model.set( 'userUpdated', _.now() );
							}
						}
					}
				};
			}

			/**
			 * Hook into the lifecycle (create)
			 * @constructor
			 * @public
			 */
			initialize() {

				// Load the HTML used for the desktop
				this.$el.html( CustomerFormHtml );

				this.render();
				Backbone.View.prototype.initialize.call( this );
			}

			/**
			 * Using the model associated with this view, render the customer into this.el
			 * @public
			 */
			render() {

				// Using Mustache - the view includes attributes from the model
				let mustacheView = _.extend( {
					isChecked: function() {
						return this.value === 'Y' ? 'checked' : '';
					},
					isUsed: function() {
						return _.isString( this.label ) && !_.isEmpty( this.label );
					}
				}, this.model.attributes );

				// Labels for software options are defined in config data
				_( mustacheView.softwareOptions ).each( option => {
					const configData = config.acr.softwareOptions[ option.name ];
					if ( _( configData ).isObject() ) {
						option.label = configData.label;
						option.order = configData.order;
					}
				} );

				// Simple render with Mustache
				$( '.options', this.$el )
					.html( Mustache.render( template, mustacheView ) );

				// How many columns of buttons?
				const widthOfContainer = $( this.$el ).width() - 180;
				const numberColumns = Math.floor( widthOfContainer / 275 );
				const elMaxHeight = config.acr.numSoftwareOptions * 35 / numberColumns;
				$( '.options', this.$el ).css( { 'maxHeight': elMaxHeight } );

				$( 'input.systemOwnerName', this.el ).val( this.model.get( 'owner' ).trim() );
				$( 'input.systemName', this.el ).val( this.model.get( 'system_name' ) );
				$( 'input.systemVersion', this.el ).val( this.model.get( 'system_version' ) );
				$( 'input.maxLocations', this.el ).val( this.model.get( 'location_max' ) );
				$( 'input.maxPosLanes', this.el ).val( this.model.get( 'max_pos_lanes' ) );
				$( 'input.maxAlternateProcs', this.el ).val( this.model.get( 'max_alternate_procs' ) );
				$( 'input.maxTerminals', this.el ).val( this.model.get( 'terminal_max' ) );
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return CustomerConfigEditorView;
	} );