import Ember from 'ember'

export default Ember.Route.extend({
  model: function () {
    /* eslint-disable new-cap */
    return Promise.all([
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
  }
})
