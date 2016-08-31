import _ from 'lodash'
import Ember from 'ember'
const {run} = Ember
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  // == Computed Properties ====================================================

  // == Functions ==============================================================

<<<<<<< HEAD
  formValueChanged (newFormValue) {
    let value
=======
  didReceiveAttrs () {
    let value

>>>>>>> da8dfb1... Add hidden-input renderer
    const currentValue = this.get('value')
    const valueRef = this.get('cellConfig.renderer.valueRef')

    if (valueRef) {
<<<<<<< HEAD
      value = _.get(newFormValue, valueRef)
=======
      value = this.get(`bunsenStore.formValue.${valueRef}`)
>>>>>>> da8dfb1... Add hidden-input renderer
    } else {
      value = this.get('bunsenModel.default')
    }

    if (this.onChange && !_.isEqual(value, currentValue)) {
      // NOTE: we must use Ember.run.later to prevent multiple updates during a render cycle
      // which throws deprecation warnings in the console for performance reasons.
      run.later(() => {
        console.log('calling onChange')
        this.onChange(this.get('bunsenId'), value)
      })
    }
  }
})
