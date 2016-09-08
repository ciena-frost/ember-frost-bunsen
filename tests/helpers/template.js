import _ from 'lodash'
import Ember from 'ember'
import {expect} from 'chai'
import {it} from 'mocha'

export function integrationTestContext (name) {
  return [
    name,
    `Integration: ${Ember.String.classify(name)}Component`,
    {
      integration: true
    }
  ]
}

export function validatePropTypes (expectedPropTypes) {
  it('has correct propType validations', function () {
    const actualPropTypes = this.subject().get('propTypes')
    const different = []
    const missing = []
    const unexpected = []

    _.forIn(expectedPropTypes, (val, key) => {
      if (!(key in actualPropTypes)) {
        missing.push(key)
        return
      }

      if (!_.isEqual(actualPropTypes[key], val)) {
        different.push(key)
      }
    })

    _.forIn(actualPropTypes, (val, key) => {
      if (key in expectedPropTypes) {
        return
      }

      unexpected.push(key)
    })

    const messages = []

    if (different.length !== 0) {
      messages.push(
        `The following propTypes are different than expected: ${different.join(', ')}`
      )
    }

    if (missing.length !== 0) {
      messages.push(
        `The following propTypes were not found but are expected: ${missing.join(', ')}`
      )
    }

    if (unexpected.length !== 0) {
      messages.push(
        `The following propTypes were found but not expected in the test: ${unexpected.join(', ')}`
      )
    }

    expect(messages).to.have.length(0, messages.join('\n'))
  })
}

/**
 * A shortcut for filling in the text context in a describeComponent
 * @param {String} name - the name of the component
 * @param {Object} options - any additional options to set
 * @returns {Object[]} an array of items that need to be passed in to describeComponent
 */
function testCtx (name, options = {}) {
  const testType = (options.unit) ? 'Unit' : 'Integration'
  return [
    name,
    `${testType}: ${Ember.String.classify(name)}Component`,
    options
  ]
}

/**
 * A shortcut for filling in the text context in a describeComponent
 * @param {String} name - the name of the component
 * @param {Object} options - any additional options to set (alongside unit: true)
 * @returns {Object[]} an array of items that need to be passed in to describeComponent
 */
export function unitTest (name, options = {}) {
  return testCtx(name, _.assign(options, {unit: true}))
}

/**
 * A shortcut for filling in the text context in a describeComponent
 * @param {String} name - the name of the component
 * @param {Object} options - any additional options to set (alongside integration: true)
 * @returns {Object[]} an array of items that need to be passed in to describeComponent
 */
export function integrationTest (name, options = {}) {
  return testCtx(name, _.assign(options, {integration: true}))
}
