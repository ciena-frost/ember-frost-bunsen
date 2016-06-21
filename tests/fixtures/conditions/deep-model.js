/**
 * A bunsen model with conditions nested below the top-level of properties
 */

import simpleModel from './simple-model'

export default {
  type: 'object',
  properties: {
    tags: simpleModel
  }
}
