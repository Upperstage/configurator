define( [ 'backbone', 'mustache' ],
	( Backbone, Mustache ) => {

		/**
		 * Return the Mustache template used to render the view
		 * @public
		 * @returns { String }
		 */
		const template = `
		<div class="buttons">
			<button type="button" disabled class="btn btn-outline-primary btn-sm new">New</button>
			<button type="button" disabled class="btn btn-primary btn-sm save">Save</button>
		</div>`;

		/**
		 * A View is an atomic chunk of user interface. It often renders the data
		 * from a specific model, or number of models — but views can also be data-less
		 * chunks of UI that stand alone.  Models should be generally unaware of views.
		 * Instead, views listen to the model "change" events, and react or re-render
		 * themselves appropriately.
		 * @public
		 */
		class CustomerConfigEditorButtons extends Backbone.View {

			/**
			 * No need to implement the constructor for a Backbone view
			 * @constructor
			 * @public
			 */
			constructor( args ) {

				super( args );
				let customerCollection = args.collection;

				// Enable the save button on any change to the collection
				customerCollection.on( 'change', function(){
					$( 'button.save', this.$el ).attr( 'disabled', false );
				}.bind(this) );
			}

			/**
			 * Setup handlers for the interesting events thrown by the model and
			 * handled by this view
			 * @public
			 */
			events() {
				return {
					'click button.save': function(){
						this.collection.each( model => {
							if( model.hasChanged() ) model.save();
						});
					}
				};
			}

			/**
			 * Hook into the lifecycle (create)
			 * @constructor
			 * @public
			 */
			initialize() {
				this.render();
				Backbone.View.prototype.initialize.call( this );
			}

			/**
			 * Using the model associated with this view, render the customer into this.el
			 * @public
			 */
			render() {
				this.$el.html( Mustache.render( template, {} ) );
			}
		}


		// RequireJS insists something be returned - in this case, the class.
		return CustomerConfigEditorButtons;
	} );