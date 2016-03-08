const expect = chai.expect
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-frost-component'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-input-text',
  'FrostBunsenInputTextComponent',
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
          'on-change': function () {},
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
      'on-change': PropTypes.func.isRequired,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired
    })

    describe('when on-change property is omitted', function () {
      beforeEach(function () {
        Ember.run(() => {
          component.set('on-change', undefined)
        })
      })

      it('does not throw an error when on-change action is triggered', function () {
        expect(function () {
          const e = {
            value: 'a'
          }
          component.get('actions.on-change').call(component, e)
        }).not.to.throw(Error)
      })
    })
  }
)
