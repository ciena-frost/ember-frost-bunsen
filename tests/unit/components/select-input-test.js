import {describeComponent} from 'ember-mocha'
import {expect} from 'chai'
import {PropTypes} from 'ember-prop-types'
import {describe, beforeEach, it} from 'mocha'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {disabledTests, renderErrorMessageTests} from 'dummy/tests/helpers/abstract-input'

describeComponent(
  'frost-bunsen-input-select',
  'FrostBunsenInputSelectComponent',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'name',
        cellConfig: Ember.Object.create({}),
        model: {},
        onChange () {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({})
      })
      ctx.component = component
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    disabledTests(ctx)
    renderErrorMessageTests(ctx)

    /**
     * Helper that creates an attribute object populated with a given store formValue
     * @param {Object} formValue - value of store formValue
     * @returns {Object} attribute object
     */
    function createAttrs (formValue) {
      return {
        store: {
          value: {
            formValue
          }
        }
      }
    }

    describe('hasQueryChanged', function () {
      let modelQuery, attrs, oldAttrs, component

      beforeEach(function () {
        modelQuery = {
          foo: '${bar}'
        }
        const formValue = {
          bar: 'baz'
        }
        const oldFormValue = {
          bar: 'bar'
        }

        attrs = createAttrs(formValue)
        oldAttrs = createAttrs(oldFormValue)

        component = this.subject({
          initialized: true,
          bunsenId: ''
        })
      })

      describe('when query is not defined', function () {
        it('returns true when queries are the same', function () {
          expect(component.hasQueryChanged(attrs, attrs, undefined)).to.be.ok
        })

        it('returns true when queries are not the same', function () {
          expect(component.hasQueryChanged(oldAttrs, attrs, undefined)).to.be.ok
        })
      })

      describe('when not initialized', function () {
        beforeEach(() => {
          component.set('initialized', false)
        })
        it('returns true when queries are the same', function () {
          expect(component.hasQueryChanged(attrs, attrs, undefined)).to.be.ok
        })

        it('returns true when queries are not the same', function () {
          expect(component.hasQueryChanged(oldAttrs, attrs, undefined)).to.be.ok
        })
      })

      describe('when queries initialized and query is defined', function () {
        it('returns false when queries are equal', function () {
          expect(component.hasQueryChanged(oldAttrs, oldAttrs, modelQuery)).to.not.be.ok
        })

        it('returns true when queries mismatch', function () {
          expect(component.hasQueryChanged(oldAttrs, attrs, modelQuery)).to.be.ok
        })
      })
    })
  }
)
