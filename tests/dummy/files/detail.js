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

  formValue: {
    firstName: 'Jane',
    lastName: 'Doe'
  }
})

// app/templates/components/foo-bar.hbs

/*
{{frost-bunsen-detail
  model=formModel
  value=formValue
}}
*/
