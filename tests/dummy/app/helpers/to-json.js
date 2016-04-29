import Ember from 'ember'
const {Helper} = Ember

export default Helper.helper(function (value) {
  return JSON.stringify(value, null, 2)
})
