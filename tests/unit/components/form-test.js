const {expect} = chai
import Ember from 'ember'
const {run} = Ember
import {describeComponent} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-form',
  'FrostBunsenFormComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject()

      run(() => {
        component.setProperties({
          model: {
            properties: {
              foo: {type: 'string'}
            },
            type: 'object'
          }
        })
      })
    })

    validatePropTypes({
      cancelLabel: PropTypes.string,
      inline: PropTypes.bool,
      model: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      onCancel: PropTypes.func,
      onChange: PropTypes.func,
      onSubmit: PropTypes.func,
      onValidation: PropTypes.func,
      renderers: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      submitLabel: PropTypes.string,
      validators: PropTypes.array,
      value: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ]),
      view: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ])
    })

    describe('store', function () {
      let store

      beforeEach(function () {
        store = component.get('store')
      })

      it('has expected formValue', function () {
        expect(store.formValue).to.eql({})
      })

      it('has expected renderers', function () {
        expect(store.renderers).to.eql({
          'multi-select': 'frost-bunsen-input-multi-select',
          'property-chooser': 'frost-bunsen-property-chooser',
          select: 'frost-bunsen-input-select'
        })
      })
    })
  }
)
