import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-wrapper',
  'Unit: Component | frost-bunsen-input-wrapper',
  {
    unit: true
  },
  function () {
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'foo',

        bunsenStore: Ember.Object.create({})
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject,
      onChange: PropTypes.func,
      readOnly: PropTypes.bool,
      required: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    describe('inputName', function () {
      describe('when model specifies enum', function () {
        beforeEach(function () {
          component.set('bunsenModel', {
            enum: ['a', 'b', 'c']
          })
        })

        it('returns select renderer', function () {
          expect(component.get('inputName')).to.equal('frost-bunsen-input-select')
        })
      })

      describe('when model specifies modelType', function () {
        beforeEach(function () {
          component.set('bunsenModel', {
            modelType: 'bar'
          })
        })

        it('returns select renderer', function () {
          expect(component.get('inputName')).to.equal('frost-bunsen-input-select')
        })
      })
    })
  }
)
