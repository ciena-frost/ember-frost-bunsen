// app/components/foo-bar.js

import Ember from 'Ember'
const {Component, Logger} = Ember

export default Component.extend({
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

// app/templates/components/foo-bar.hbs

/*
{{frost-bunsen-form
  model=formModel
  onChange=(action "onFormValueChange")
  onValidation=(action "onFormValidation")
  value=formValue
}}
*/
