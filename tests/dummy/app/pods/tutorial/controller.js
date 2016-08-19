import Ember from 'ember'
const {Controller} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

import steps from './steps'

export default Controller.extend({
  @readOnly
  @computed('model.currentStepIndex')
  currentStep (currentStepIndex) {
    return steps[currentStepIndex]
  },

  @readOnly
  @computed('model.currentStepIndex')
  showNextStepButton (currentStepIndex) {
    return currentStepIndex < steps.length - 1
  },

  @readOnly
  @computed('model.currentStepIndex')
  showPreviousStepButton (currentStepIndex) {
    return currentStepIndex > 0
  },

  actions: {
    next () {
      const currentStepIndex = this.get('model.currentStepIndex')
      const nextSlug = steps[currentStepIndex + 1].slug
      this.transitionToRoute('tutorial', nextSlug)
    },

    previous () {
      const currentStepIndex = this.get('model.currentStepIndex')
      const previousSlug = steps[currentStepIndex - 1].slug
      this.transitionToRoute('tutorial', previousSlug)
    }
  }
})
