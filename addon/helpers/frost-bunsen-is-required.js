import Ember from 'ember'
const {Helper} = Ember

import {isRequired} from 'ember-frost-bunsen/utils'

export function helper (args, {cell, cellDefinitions, bunsenModel, value}) {
  return isRequired(cell, cellDefinitions, bunsenModel, value)
}

export default Helper.helper(helper)
