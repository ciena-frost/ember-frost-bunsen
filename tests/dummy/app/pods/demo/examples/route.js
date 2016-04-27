import Ember from 'ember'
const {Route} = Ember

export default Route.extend({
  model () {
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
