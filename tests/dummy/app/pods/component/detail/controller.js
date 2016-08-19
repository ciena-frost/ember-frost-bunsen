import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
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
