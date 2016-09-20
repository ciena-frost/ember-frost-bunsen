/* global fillIn */

import {$hook} from 'ember-hook'

/**
 * Fill in bunsen input with value
 * @param {String} bunsenId - identifier of bunsen property to fill in
 * @param {Any} value - value to set input to
 * @param {String} [hook='bunsenForm'] - hook passed into bunsen form instance
 * @returns {RSVP.Promise} promise that resolves when all async behavior completes
 */
export function fillInBunsenInput (bunsenId, value, hook = 'bunsenForm') {
  const hookName = `${hook}-${bunsenId}-input`
  return fillIn($hook(hookName), value)
}

export default {
  fillInBunsenInput
}
