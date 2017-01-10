import Ember from 'ember'
const {Route} = Ember

import steps from 'dummy/pods/tutorial/steps'

export default Route.extend({
  beforeModel () {
    const slug = steps[0].slug
    this.transitionTo(`/tutorial/${slug}`)
  }
})
