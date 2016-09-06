import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-form',
  'Unit: Component | frost-bunsen-form',
  {
    unit: true
  },
  function () {
    let component, onChangeSpy, onValidationSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()
      onValidationSpy = sandbox.spy()
      component = this.subject({
        bunsenModel: {
          properties: {
            bar: {type: 'string'},
            baz: {type: 'number'},
            foo: {type: 'string'}
          },
          required: ['foo'],
          type: 'object'
        },
        onChange: onChangeSpy,
        onValidation: onValidationSpy
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    validatePropTypes({
      autofocus: PropTypes.bool,
      bunsenModel: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      bunsenView: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      disabled: PropTypes.bool,
      hook: PropTypes.string,
      onChange: PropTypes.func,
      onValidation: PropTypes.func,
      registeredComponents: PropTypes.array,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      showAllErrors: PropTypes.bool,
      validators: PropTypes.array,
      value: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ])
    })

    it('actions.onTabChange() updates selectedTabIndex', function () {
      [0, 1, 2].forEach((index) => {
        component.actions.onTabChange.call(component, index)
        expect(component.get('selectedTabIndex')).to.eql(index)
      })
    })
  }
)
