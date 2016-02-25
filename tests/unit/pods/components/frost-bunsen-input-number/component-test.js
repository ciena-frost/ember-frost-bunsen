const expect = chai.expect
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-input-number',
  'FrostBunsenInputNumberComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject()

      Ember.run(() => {
        component.setProperties({
          bunsenId: 'name',
          cellConfig: Ember.Object.create({}),
          model: {},
          onChange: function () {},
          store: Ember.Object.create({}),
          state: Ember.Object.create({})
        })
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      initialValue: PropTypes.oneOf([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ]),
      label: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        Ember.run(() => {
          component.set('onChange', undefined)
        })
      })

      it('does not throw an error when onChange action is triggered', function () {
        expect(function () {
          const e = {
            value: '1'
          }
          component.get('actions.onChange').call(component, e)
        }).not.to.throw(Error)
      })
    })
  }
)
