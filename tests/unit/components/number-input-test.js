const expect = chai.expect
const {run} = Ember
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-number',
  'FrostBunsenInputNumberComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject()

      run(() => {
        component.setProperties({
          bunsenId: 'name',
          cellConfig: Ember.Object.create({}),
          model: {},
          onChange () {},
          store: Ember.Object.create({}),
          state: Ember.Object.create({})
        })
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOf([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.oneOf([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        run(() => {
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
