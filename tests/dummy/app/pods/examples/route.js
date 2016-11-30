import Ember from 'ember'
const {Route, RSVP} = Ember

export default Route.extend({
  model () {
    /* eslint-disable new-cap */
    return RSVP.all([
      this.store.findAll('model'),
      this.store.findAll('value'),
      this.store.findAll('view')
    ])
      .then(([models, values, views]) => {
        return {
          models,
          values,
          views
        }
      })
    /* eslint-enable new-cap */
  },

  setupController (controller, model) {
    this._super(...arguments)
    if (controller.get('selectedModelId')) {
      controller.set('viewSelectionDisabled', false)
    }
    if (controller.get('selectedViewId')) {
      controller.set('valueSelectionDisabled', false)
    }
  }
})
