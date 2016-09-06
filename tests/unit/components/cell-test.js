import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {removeIndex} from 'ember-frost-bunsen/components/cell'

describe('Unit: removeIndex()', function () {
  it('removes index from path with index', function () {
    expect(removeIndex('foo.bar.0')).to.equal('foo.bar')
  })

  it('returns original path when no index to remove', function () {
    expect(removeIndex('foo.bar')).to.equal('foo.bar')
  })
})

describeComponent(
  'frost-bunsen-cell',
  'Unit: Component | frost-bunsen-cell',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenModel: {},
        bunsenView: {},
        cellConfig: {},
        errors: {},
        onChange () {},
        value: {}
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string,
      bunsenModel: PropTypes.object.isRequired,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object.isRequired,
      errors: PropTypes.object.isRequired,
      formDisabled: PropTypes.bool,
      onChange: PropTypes.func.isRequired,
      registerForFormValueChanges: PropTypes.func,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      readOnly: PropTypes.bool,
      showAllErrors: PropTypes.bool,
      value: PropTypes.object.isRequired
    })
  }
)
