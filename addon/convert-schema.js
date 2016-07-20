import Ember from 'ember'
import evaluateConditions from './evaluate-conditions'
const deprecationMessage = 'The module "convert-schema" has been moved to "evaluate-conditions"'
Ember.deprecate(deprecationMessage, false, {id: 'bunsen.convert-schema'})
export default evaluateConditions
