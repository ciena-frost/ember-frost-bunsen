import Ember from 'ember'
const {get, run} = Ember
import _ from 'lodash'

import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  // == Computed Properties ====================================================

  // == Functions ==============================================================

  /* eslint-disable complexity */
  formValueChanged (newFormValue) {
    let value
    // using currentValue cache since using this.get('value') takes 2 additional
    // cycles to update
    const currentValue = this.get('currentValue') || this.get('value')
    const valueRef = this.get('cellConfig.renderer.valueRef')

    if (valueRef) {
      value = get(newFormValue || {}, valueRef)
    } else {
      value = this.get('bunsenModel.default')
    }

    if (this.onChange && !_.isEqual(value, currentValue)) {
      // set local currentValue cache to compare on the next run and prevent further onChange events
      // from being called
      this.set('currentValue', value)
      run.schedule('afterRender', () => {
        this.onChange(this.get('bunsenId'), value)
      })
    }
  },
  /* eslint-enable complexity */

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  }
})
