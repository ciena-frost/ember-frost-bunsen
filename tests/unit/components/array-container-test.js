import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import _ from 'lodash'
import {validatePropTypes} from '../../utils/template'

/**
 * This is used instead of setProperties() so life cycle hooks get correct attrs
 * information.
 * @param {Ember.Component} component - component we are testing
 * @param {Object} props - properties we want to update on component
 */
function setPropsAndAttrs (component, props) {
  let oldAttrs = null
  const newAttrs = {}

  _.forIn(props, (value, key) => {
    newAttrs[key] = {value}
  })

  if (component.attrs) {
    oldAttrs = Object.assign({}, component.attrs)
    Object.assign(component.attrs, newAttrs)
  } else {
    _.set(component, 'attrs', newAttrs)
  }

  component.trigger('didUpdateAttrs', {newAttrs, oldAttrs})
  component.trigger('didReceiveAttrs', {newAttrs, oldAttrs})
}

/**
 * Helper function to generate cellConfig property for tests
 * @param {Boolean} autoAdd - whether or not to automatically add an empty item
 * @returns {BunsenCellConfig} cell configuration
 */
function generateCellConfig (autoAdd) {
  return {
    item: {
      autoAdd,
      container: 'person',
      label: 'person'
    },
    model: 'people'
  }
}

/**
 * Helper function to generate view property for tests
 * @param {BunsenCellConfig} cellConfig - cell configuration
 * @returns {BunsenView} view
 */
function generateView (cellConfig) {
  return {
    containers: [
      {

        id: 'main',
        rows: [
          [cellConfig]
        ]
      },
      {
        id: 'people',
        rows: [
          [{model: 'name.first'}],
          [{model: 'name.last'}],
          [{model: 'age'}]
        ]
      }
    ],
    rootContainers: [{
      container: 'main',
      label: 'Main'
    }],
    type: 'form',
    version: '1.0'
  }
}

const model = {
  items: {
    properties: {
      age: {type: 'number'},
      name: {
        first: {type: 'string'},
        last: {type: 'string'}
      }
    },
    type: 'object'
  }
}

describeComponent(
  'frost-bunsen-array-container',
  'FrostBunsenArrayContainerComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.object.isRequired
    })

    let component, onChangeSpy, sandbox

    beforeEach(function () {
      const cellConfig = generateCellConfig(false)

      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()

      component = this.subject({
        bunsenId: 'people',
        cellConfig: Ember.Object.create(cellConfig),
        errors: {},
        model,
        onChange: onChangeSpy,
        store: Ember.Object.create({
          formValue: {},
          renderers: {},
          view: generateView(cellConfig)
        }),
        value: null
      })
    })

    it('readOnly defaults to false', function () {
      expect(component.get('readOnly')).to.be.false
    })

    it('does not add an empty item to array', function () {
      expect(component.get('items').length).to.eq(0)
    })

    describe('when autoAdd is enabled', function () {
      beforeEach(function () {
        const cellConfig = generateCellConfig(true)

        setPropsAndAttrs(component, {
          cellConfig: Ember.Object.create(cellConfig),
          store: Ember.Object.create({
            formValue: {},
            renderers: {},
            view: generateView(cellConfig)
          })
        })
      })

      it('adds an empty item to array', function () {
        expect(component.get('items').length).to.eq(1)
      })
    })
  }
)
