import _ from 'lodash'
import Ember from 'ember'
const {run} = Ember
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  // == Computed Properties ====================================================

  // == Functions ==============================================================

  formValueChanged (newFormValue) {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return
    }

    let value
    const currentValue = this.get('value')
    const valueRef = this.get('cellConfig.renderer.valueRef')

    if (valueRef) {
      value = _.get(newFormValue, valueRef)
    } else {
      value = this.get('bunsenModel.default')
    }

    if (this.onChange && !_.isEqual(value, currentValue)) {
      // NOTE: we must use Ember.run.later to prevent multiple updates during a render cycle
      // which throws deprecation warnings in the console for performance reasons.
      run.later(() => {
        this.onChange(this.get('bunsenId'), value)
      })
    }
  },

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  }
})
