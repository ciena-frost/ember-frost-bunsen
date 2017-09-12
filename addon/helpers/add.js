/**
 * Helper definition for the add helper
 */
import Ember from 'ember'
const {Helper} = Ember

export function add (params) {
  return params.reduce((prev, cur) => prev + cur)
}

export default Helper.helper(add)
