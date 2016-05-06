import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {builtInRenderers} from 'ember-frost-bunsen/validator/index'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-cell',
  'FrostBunsenCellComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string,
      config: PropTypes.EmberObject.isRequired,
      defaultClassName: PropTypes.string,
      errors: PropTypes.object.isRequired,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.object.isRequired
    })

    let component, onChangeSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()

      component = this.subject({
        bunsneId: 'foo',
        config: {
          model: 'foo'
        },
        errors: {},
        model: {
          properties: {
            foo: {type: 'string'}
          },
          type: 'object'
        },
        onChange: onChangeSpy,
        store: Ember.Object.create({
          formValue: {},
          renderers: builtInRenderers,
          view: {}
        }),
        value: {}
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
      component.set('errors', {foo: [error]})
      expect(component.get('errorMessage').toString()).to.eql(error)
    })

    it('errorMessage returns multiple errors', function () {
      const error1 = 'what is foo without a little bar'
      const error2 = 'baz is feeling lonely'
      component.set('errors', {foo: [error1, error2]})
      expect(component.get('errorMessage').toString()).to.eql(`${error1}<br>${error2}`)
    })
  }
)
