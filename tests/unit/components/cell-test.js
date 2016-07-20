import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {removeIndex} from 'ember-frost-bunsen/components/cell'

describe('removeIndex()', function () {
  it('removes index from path with index', function () {
    expect(removeIndex('foo.bar.0')).to.equal('foo.bar')
  })

  it('returns original path when no index to remove', function () {
    expect(removeIndex('foo.bar')).to.equal('foo.bar')
  })
})

describeComponent(
  'frost-bunsen-cell',
  'FrostBunsenCellComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        config: Ember.Object.create({}),
        errors: {},
        onChange () {},
        value: {}
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      config: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      value: PropTypes.object.isRequired
    })
  }
)
