import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-button-group',
  'FrostBunsenInputButtonGroupComponent',
  {},
  function () {
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

    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'foo',
        cellConfig: Ember.Object.create({
          properties: {
            model: 'foo',
            type: 'button-group'
          }
        }),
        model: {
          type: 'boolean'
        },
        onChange () {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({})
      })
    })

    it('size defaults to medium', function () {
      expect(component.get('size')).to.eql('medium')
    })

    it('size can be overridden by properties.size', function () {
      component.set('cellConfig.properties', {size: 'small'})
      expect(component.get('size')).to.eql('small')
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        component.set('onChange', undefined)
      })

      it('does not throw an error when onChange action is triggered', function () {
        expect(function () {
          component.get('actions.onChange').call(component, 0)
        }).not.to.throw(Error)
      })
    })
  }
)
