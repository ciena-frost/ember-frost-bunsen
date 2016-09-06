import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-array-inline-item',
  'Unit: Component | frost-bunsen-array-inline-item',
  {
    unit: true
  },
  function () {
    let onChangeSpy, onRemoveSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()
      onRemoveSpy = sandbox.spy()

      this.subject({
        bunsenId: 'foo',
        bunsenModel: {
          properties: {
            foo: {
              items: {
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
        bunsenView: {},
        cellConfig: {
          arrayOptions: {
            itemCell: {}
          }
        },
        errors: {},
        index: 0,
        onChange: onChangeSpy,
        onRemove: onRemoveSpy,
        registerForFormValueChanges () {},
        sortable: false,
        value: {foo: []}
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object.isRequired,
      errors: PropTypes.object.isRequired,
      formDisabled: PropTypes.bool,
      index: PropTypes.number.isRequired,
      onChange: PropTypes.func.isRequired,
      onRemove: PropTypes.func,
      readOny: PropTypes.bool,
      registerForFormValueChanges: PropTypes.func.isRequired,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      showAllErrors: PropTypes.bool,
      showRemoveButton: PropTypes.bool,
      sortable: PropTypes.bool.isRequired,
      value: PropTypes.object.isRequired
    })
  }
)
