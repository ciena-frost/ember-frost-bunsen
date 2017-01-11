import Ember from 'ember'
const {Route} = Ember

import steps from './steps'

export default Route.extend({
  model ({slug}) {
    const currentStepIndex = steps.findIndex((step) => step.slug === slug)

    return {
      currentStepIndex
    }
  }
})
