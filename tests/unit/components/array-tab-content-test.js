import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {builtInRenderers} from 'ember-frost-bunsen/validator/index'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-array-tab-content',
  'FrostBunsenArrayTabContentComponent',
  {
    unit: true
  },
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      index: PropTypes.number.isRequired,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOny: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.object.isRequired
    })

    let component, onChangeSpy, onRemoveSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()
      onRemoveSpy = sandbox.spy()

      component = this.subject({
        bunsenId: 'foo',
        config: {},
        errors: {},
        index: 0,
        model: {
          properties: {
            foo: {
              item: {
                properties: {
                  bar: {type: 'string'}
                },
                type: 'object'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        onChange: onChangeSpy,
        onRemove: onRemoveSpy,
        store: Ember.Object.create({
          formValue: {
            foo: [{}]
          },
          renderers: builtInRenderers,
          view: {}
        }),
        value: {foo: []}
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('errorMessage returns null when no erorrs', function () {
      component.set('errors', {})
      expect(component.get('errorMessage')).to.be.null
    })

    it('errorMessage returns signle error', function () {
      const error = 'what is foo without a little bar'
      component.set('errors', {'foo.0': [error]})
      expect(component.get('errorMessage').toString()).to.eql(error)
    })

    it('errorMessage returns multiple errors', function () {
      const error1 = 'what is foo without a little bar'
      const error2 = 'baz is feeling lonely'
      component.set('errors', {'foo.0': [error1, error2]})
      expect(component.get('errorMessage').toString()).to.eql(`${error1}<br>${error2}`)
    })
  }
)
