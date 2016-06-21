import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-static',
  'FrostBunsenInputStaticComponent',
  {
    unit: true
  },
  function () {
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'name',
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        onChange () {},
        state: Ember.Object.create({})
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      onChange: PropTypes.func.isRequired,
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

    describe('renderValue', function () {
      [
        {in: null, out: '—'},
        {in: undefined, out: '—'},
        {in: '', out: '—'},
        {in: 'test', out: 'test'}
      ].forEach((test) => {
        it(`returns "${test.out}" when value is ${test.in} (${typeof test.in})`, function () {
          component.set('value', test.in)
          expect(component.get('renderValue')).to.equal(test.out)
        })
      })
    })
  }
)
