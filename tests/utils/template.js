const expect = chai.expect
const {HTMLBars} = Ember
import _ from 'lodash'
import Ember from 'ember'
import {describeComponent} from 'ember-mocha'
import {beforeEach, it} from 'mocha'

export function buildRenderfunction (template) {
  return function (renderer, props) {
    renderer.setProperties(props)

    renderer.render(template)
  }
}

export function renderWithProps (renderer, componentName, props, more) {
  renderer.setProperties(props)

  const templateOptions = Object.keys(props).map((key) => {
    return `${key}=${key}`
  }).join(' ')

  const template = `{{${componentName} ${templateOptions} ${more || ''}}}`
  const compiledTemplate = HTMLBars.compile(template)

  renderer.render(compiledTemplate)

  return renderer.$('> *')
}

export function integrationTestContext (name) {
  return [
    name,
    `Integration: ${Ember.String.classify(name)}Component`,
    {
      integration: true
    }
  ]
}

export function setupComponentTest (name, props, tests) {
  describeComponent(...integrationTestContext(name),
    function () {
      let ctx = {}

      beforeEach(function () {
        ctx.rootNode = renderWithProps(this, name, props)
      })

      tests(ctx)
    }
  )
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
