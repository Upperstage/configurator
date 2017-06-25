define( [ 'backbone', 'mustache', 'moment' ],
	( Backbone, Mustache, moment ) => {

		/**
		 * The Mustache template used to render the view
		 * @private
		 */
		const template =
			`{{# isVisible }}
				<a class="customer-main">{{ owner }}</a>
				<div class="customer-details">{{ serialNumber }}<span class="separator"/>{{ system_name }}<span class="separator"/>version: {{ softwareVersion }}<span class="separator"/>last updated: {{lastUpdated}}</div>
			{{/ isVisible }}`;


		/**
		 * A View is an atomic chunk of user interface. It often renders the data
		 * from a specific model, or number of models — but views can also be data-less
		 * chunks of UI that stand alone.  Models should be generally unaware of views.
		 * Instead, views listen to the model "change" events, and react or re-render
		 * themselves appropriately.
		 * @public
		 */
		class CustomerConfigReadOnlyView extends Backbone.View {

			/**
			 * No need to implement the constructor for a Backbone view
			 * @constructor
			 * @public
			 */
			constructor( args ) {
				super( args );
			}

			/**
			 * Setup handlers for the interesting events thrown by the model and
			 * handled by this view
			 * @public
			 */
			events() {
				return {
					'click a.customer-main': function() {
					this.trigger( 'userRequestedShow' );
					}
				};
			}

			/**
			 * Hook into the lifecycle (create)
			 * @constructor
			 * @public
			 */
			initialize() {
				// Any changes to model? Render view.
				this.listenTo( this.model, 'change', this.render.bind( this ) );
				this.render();
				Backbone.View.prototype.initialize.call( this );
			}

			/**
			 * Using the model associated with this view, render the customer into this.el
			 * @public
			 */
			render() {

				// Using Mustache - the view includes attributes from the model
				const mustacheView = _.extend( {
					isVisible: function() {
						return this.visible;
					},
					lastUpdated: function() {
						return moment( this.original_update_date ).fromNow();
					},
					serialNumber: function() {
						return `#${this.sw_serial_number}`;
					},
					softwareVersion: function() {
						return `v${this.system_version.trim()}`;
					}
				}, this.model.attributes );

				// Simple render with Mustache
				this.$el.html( Mustache.render( template, mustacheView ) );
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return CustomerConfigReadOnlyView;
	} );