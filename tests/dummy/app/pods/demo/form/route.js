import Ember from 'ember'

export default Ember.Route.extend({
  model: function () {
    /* eslint-disable new-cap */
    return Promise.all([
      this.store.findAll('model')
    ])
      .then((results) => {
        return {
          models: results[0],
          views: []
        }
      })
    /* eslint-enable new-cap */
  }
})
