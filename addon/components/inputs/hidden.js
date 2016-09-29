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
    // using currentValue cache since depending since this.get('value') takes 2 additional
    // cycles to update
    const currentValue = this.get('currentValue') || this.get('value')
    const valueRef = this.get('cellConfig.renderer.valueRef')

    if (valueRef) {
      value = _.get(newFormValue, valueRef)
    } else {
      value = this.get('bunsenModel.default')
    }

    if (this.onChange && !_.isEqual(value, currentValue)) {
      // set local currentValue cache to compare on the next run and prevent further onChange events
      // from being called
      this.set('currentValue', value)
      run.schedule('sync', () => {
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
