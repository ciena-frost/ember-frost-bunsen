import {expect} from 'chai'
import Ember from 'ember'
const {assign} = Ember
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import _ from 'lodash'
import {validatePropTypes} from 'dummy/tests/helpers/template'

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
    oldAttrs = assign({}, component.attrs)
    assign(component.attrs, newAttrs)
  } else {
    _.set(component, 'attrs', newAttrs)
  }

  component.setProperties(props)

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

    afterEach(function () {
      sandbox.restore()
    })

    it('has correct classes', function () {
      const classNames = component.get('classNames')
      expect(classNames).to.include('frost-bunsen-array-container')
      expect(classNames).to.include('frost-bunsen-section')
    })

    it('readOnly defaults to false', function () {
      expect(component.get('readOnly')).to.be.false
    })

    describe('addLabel', function () {
      it('singularizes label', function () {
        component.set('cellConfig.label', 'addresses')
        expect(component.get('addLabel')).to.eql('Add address')
      })

      it('lowercases label', function () {
        component.set('cellConfig.label', 'ADDRESS')
        expect(component.get('addLabel')).to.eql('Add address')
      })
    })

    describe('inline', function () {
      it('returns true when property is undefined', function () {
        component.set('cellConfig.item.inline', undefined)
        expect(component.get('inline')).to.be.true
      })

      it('returns true when property is true', function () {
        component.set('cellConfig.item.inline', true)
        expect(component.get('inline')).to.be.true
      })

      it('returns false when property is null', function () {
        component.set('cellConfig.item.inline', null)
        expect(component.get('inline')).to.be.false
      })

      it('returns false when property is false', function () {
        component.set('cellConfig.item.inline', false)
        expect(component.get('inline')).to.be.false
      })
    })

    describe('sortable', function () {
      [
        undefined,
        null,
        false,
        'a',
        1
      ].forEach((enabled) => {
        it(`returns false when enabled is ${enabled}`, function () {
          component.set('cellConfig.item.sortable', enabled)
          expect(component.get('sortable')).to.be.false
        })
      })

      it('returns true when enabled is true', function () {
        component.set('cellConfig.item.sortable', true)
        expect(component.get('sortable')).to.be.true
      })
    })

    it('does not add an empty item to array', function () {
      expect(component.get('items').length).to.equal(0)
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
        expect(component.get('items').length).to.equal(1)
      })

      describe('actions.onRemoveItem()', function () {
        beforeEach(function () {
          component.actions.onRemoveItem.call(component, 0)
        })

        it('does not allow empty item to be removed', function () {
          expect(component.get('items').length).to.eql(1)
        })

        it('does not trigger onChange event', function () {
          expect(onChangeSpy.callCount).to.eql(0)
        })
      })

      describe('then autoAdd is disabled', function () {
        beforeEach(function () {
          const cellConfig = generateCellConfig(false)

          setPropsAndAttrs(component, {
            cellConfig: Ember.Object.create(cellConfig),
            store: Ember.Object.create({
              formValue: {},
              renderers: {},
              view: generateView(cellConfig)
            })
          })
        })

        it('removes empty item from array', function () {
          expect(component.get('items').length).to.equal(0)
        })
      })
    })

    describe('actions', function () {
      describe('.onAddItem()', function () {
        let itemCount

        beforeEach(function () {
          itemCount = component.get('items').length
          sandbox.spy(component, 'notifyParentOfNewItem')
          component.actions.onAddItem.call(component)
        })

        it('adds an item to items array', function () {
          expect(component.get('items').length).to.eql(itemCount + 1)
        })

        it('notifies parent of new item', function () {
          expect(component.notifyParentOfNewItem.callCount).to.eql(1)
        })
      })

      describe('.onChange()', function () {
        beforeEach(function () {
          sandbox.stub(component.actions, 'onRemoveItem')
        })

        describe('when autoAdd is not enabled', function () {
          let bunsenId, value

          beforeEach(function () {
            bunsenId = 'people.0.age'
            value = 32
            component.set('cellConfig.item.autoAdd', false)
            component.actions.onChange.call(component, bunsenId, value)
          })

          it('propagates event to onChange() property', function () {
            expect(onChangeSpy.lastCall.args).to.eql([bunsenId, value])
          })
        })

        describe('when autoAdd is enabled', function () {
          beforeEach(function () {
            component.set('cellConfig.item.autoAdd', true)
          })

          describe('when setting a value', function () {
            let bunsenId, value

            beforeEach(function () {
              bunsenId = 'people.0.age'
              value = 32
              component.actions.onChange.call(component, bunsenId, value)
            })

            it('propagates event to onChange() property', function () {
              expect(onChangeSpy.lastCall.args).to.eql([bunsenId, value])
            })
          })

          ;[undefined, null, ''].forEach((value) => {
            describe(`when only item property set and clearing value with ${value}`, function () {
              let bunsenId

              beforeEach(function () {
                bunsenId = 'people.0.age'
                const item = {age: 42}
                component.get('items').pushObject(item)
                component.set('store.formValue.people', [item])
                component.actions.onChange.call(component, bunsenId, value)
              })

              it('removes item', function () {
                expect(component.actions.onRemoveItem.callCount).to.eql(1)
              })

              it('does not propagate event to onChange() property', function () {
                expect(onChangeSpy.callCount).to.eql(0)
              })
            })

            describe(`when only item property set and clearing nested value with ${value}`, function () {
              let bunsenId

              beforeEach(function () {
                bunsenId = 'people.0.name.first'
                const item = {
                  name: {first: 'John'}
                }
                component.get('items').pushObject(item)
                component.set('store.formValue.people', [item])
                component.actions.onChange.call(component, bunsenId, value)
              })

              it('removes item', function () {
                expect(component.actions.onRemoveItem.callCount).to.eql(1)
              })

              it('does not propagate event to onChange() property', function () {
                expect(onChangeSpy.callCount).to.eql(0)
              })
            })

            describe(`when not only item property set and clearing value with ${value}`, function () {
              let bunsenId

              beforeEach(function (done) {
                bunsenId = 'people.0.age'
                const item = {
                  age: 42,
                  name: {first: 'John'}
                }

                onChangeSpy = sandbox.spy(() => {
                  done()
                })

                component.set('onChange', onChangeSpy)
                component.get('items').pushObject(item)
                component.set('store.formValue.people', [item])
                component.actions.onChange.call(component, bunsenId, value)
              })

              it('does not remove item', function () {
                expect(component.actions.onRemoveItem.callCount).to.eql(0)
              })

              it('propagates event to onChange() property', function () {
                expect(onChangeSpy.lastCall.args[0]).to.eql('people.0')
                expect(onChangeSpy.lastCall.args[1]).to.eql({
                  name: {
                    first: 'John'
                  }
                })
              })
            })

            describe(`when not only item property set and clearing nested value with ${value}`, function () {
              let bunsenId

              beforeEach(function (done) {
                bunsenId = 'people.0.name.first'
                const item = {
                  age: 42,
                  name: {first: 'John'}
                }

                onChangeSpy = sandbox.spy(() => {
                  done()
                })

                component.set('onChange', onChangeSpy)
                component.get('items').pushObject(item)
                component.set('store.formValue.people', [item])
                component.actions.onChange.call(component, bunsenId, value)
              })

              it('does not remove item', function () {
                expect(component.actions.onRemoveItem.callCount).to.eql(0)
              })

              it('propagates event to onChange() property', function () {
                expect(onChangeSpy.lastCall.args[0]).to.eql('people.0')
                expect(onChangeSpy.lastCall.args[1]).to.eql({
                  age: 42
                })
              })
            })

            describe(`when not only nested item property set and clearing nested value with ${value}`, function () {
              let bunsenId

              beforeEach(function (done) {
                bunsenId = 'people.0.name.first'
                const item = {
                  name: {
                    first: 'John',
                    last: 'Doe'
                  }
                }

                onChangeSpy = sandbox.spy(() => {
                  done()
                })

                component.set('onChange', onChangeSpy)
                component.get('items').pushObject(item)
                component.set('store.formValue.people', [item])
                component.actions.onChange.call(component, bunsenId, value)
              })

              it('does not remove item', function () {
                expect(component.actions.onRemoveItem.callCount).to.eql(0)
              })

              it('propagates event to onChange() property', function () {
                expect(onChangeSpy.lastCall.args[0]).to.eql('people.0.name')
                expect(onChangeSpy.lastCall.args[1]).to.eql({
                  last: 'Doe'
                })
              })
            })
          })
        })
      })

      describe('.onRemoveItem()', function () {
        let item1, item2, itemCount

        beforeEach(function () {
          const items = component.get('items')
          item1 = {age: 21}
          item2 = {age: 42}
          items.pushObjects([item1, item2])
          itemCount = items.length
        })

        describe('when first item removed', function () {
          beforeEach(function () {
            component.actions.onRemoveItem.call(component, itemCount - 2)
          })

          it('removes an item from items array', function () {
            expect(component.get('items').length).to.eql(itemCount - 1)
          })

          it('removes first item', function () {
            expect(component.get('items')).not.to.contain(item1)
          })

          it('does not remove second item', function () {
            expect(component.get('items')).to.contain(item2)
          })

          it('calls onChange() property with expect arguments', function () {
            expect(onChangeSpy.lastCall.args).to.eql([
              'people',
              component.get('items')
            ])
          })
        })

        describe('when second item removed', function () {
          beforeEach(function () {
            component.actions.onRemoveItem.call(component, itemCount - 1)
          })

          it('removes an item from items array', function () {
            expect(component.get('items').length).to.eql(itemCount - 1)
          })

          it('does not remove first item', function () {
            expect(component.get('items')).to.contain(item1)
          })

          it('removes second item', function () {
            expect(component.get('items')).not.to.contain(item2)
          })

          it('calls onChange() property with expect arguments', function () {
            expect(onChangeSpy.lastCall.args).to.eql([
              'people',
              component.get('items')
            ])
          })
        })
      })

      describe('.onReorderItems()', function () {
        let jane, john

        beforeEach(function () {
          jane = {
            age: 26,
            name: {
              first: 'Jane',
              last: 'Doe'
            }
          }

          john = {
            age: 28,
            name: {
              first: 'John',
              last: 'Smith'
            }
          }

          const items = [jane, john]

          component.set('store.formValue.people', items)
          component.set('items', items)
          component.actions.onReorderItems.call(component, [john, jane])
        })

        it('updates items state', function () {
          expect(component.get('items')).to.eql([john, jane])
        })

        it('informs consumer of new array order', function () {
          const args = onChangeSpy.lastCall.args
          expect(args[0]).to.eql('people')
          expect(args[1]).to.eql([john, jane])
        })
      })
    })
  }
)
