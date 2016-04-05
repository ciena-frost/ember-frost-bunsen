import Ember from 'ember'
const {Route} = Ember

export default Route.extend({
  model () {
    /* eslint-disable new-cap */
    return Promise.all([
      this.store.findAll('model')
    ])
      .then((results) => {
        return {
          models: results[0],
          values: [],
          views: []
        }
      })
    /* eslint-enable new-cap */
  }
})
