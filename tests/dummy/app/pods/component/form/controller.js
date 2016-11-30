import Ember from 'ember'
const {Controller, Logger} = Ember

export default Controller.extend({
  formModel: {
    properties: {
      firstName: {type: 'string'},
      lastName: {type: 'string'}
    },
    type: 'object'
  },

  formValue: {},

  actions: {
    onFormValueChange (value) {
      this.set('formValue', value)
    },

    onFormValidation (validationResults) {
      Logger.info(validationResults)
    }
  }
})
