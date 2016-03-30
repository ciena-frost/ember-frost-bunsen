const expect = chai.expect
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-input-boolean',
  'FrostBunsenInputBooleanComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject()

      Ember.run(() => {
        component.setProperties({
          bunsenId: 'enabled',
          cellConfig: Ember.Object.create({}),
          model: {},
          onChange: function () {},
          store: Ember.Object.create({}),
          state: Ember.Object.create({value: true})
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
          component.get('actions.onChange').call(component)
        }).not.to.throw(Error)
      })
    })
  }
)
