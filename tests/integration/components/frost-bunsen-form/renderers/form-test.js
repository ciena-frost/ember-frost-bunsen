import Ember from 'ember'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenTextRendererWithState,
  expectOnChangeState,
  expectOnValidationState,
  fillInBunsenTextRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

const {RSVP} = Ember

describe('Integration: Component / frost-bunsen-form / renderer / form', function () {
  describe('basic', function () {
    let ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          name: {
            type: 'object',
            properties: {
              first: {
                title: 'First Name',
                type: 'string'
              },
              last: {
                title: 'Last Name',
                type: 'string'
              }
            }
          }
        },
        type: 'object'
      },
      bunsenView: {
        type: 'form',
        version: '2.0',
        cells: [{
          model: 'name'
        }]
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render', function () {
      expectBunsenTextRendererWithState('name.first', {label: 'First Name'})
      expectBunsenTextRendererWithState('name.last', {label: 'Last Name'})
    })

    describe('when user inputs value', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        fillInBunsenTextRenderer('name.first', 'Clark')
        return wait()
      })

      it('functions as expected', function () {
        expectBunsenTextRendererWithState('name.first', {
          label: 'First Name',
          value: 'Clark'
        })
        expectOnChangeState(ctx, {
          name: {
            first: 'Clark'
          }
        })
        expectOnValidationState(ctx, {count: 1})
      })
    })
  })

  describe('dynamic', function () {
    let ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          dynamic: {
            type: 'object',
            properties: {}
          }
        },
        type: 'object'
      },
      bunsenView: {
        type: 'form',
        version: '2.0',
        cells: [{
          model: 'dynamic',
          renderer: {
            name: 'form',
            plugin: {
              name: 'dynamic'
            }
          }
        }]
      },
      validators: [
        () => {
          return RSVP.resolve({
            value: {
              errors: [{
                path: '#/'
              }],
              warnings: []
            }
          })
        }
      ],
      plugins: {
        dynamic () {
          return RSVP.resolve({
            model: {
              type: 'object',
              properties: {
                dynamicProperty: {
                  type: 'string'
                }
              }
            }
          })
        }
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render', function () {
      expectBunsenTextRendererWithState('dynamic.dynamicProperty', {label: 'Dynamic property'})
    })

    it('should use passed in validators', function () {
      expectOnValidationState(ctx, {
        count: 1,
        errors: [
          {'path': '#/'},
          {'path': '#/dynamic/'}
        ]
      })
    })
  })

  describe('dynamic and nested', function () {
    let ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          dynamic: {
            type: 'object',
            properties: {}
          }
        },
        type: 'object'
      },
      bunsenView: {
        type: 'form',
        version: '2.0',
        cells: [{
          model: 'dynamic',
          renderer: {
            name: 'form',
            plugin: {
              name: 'dynamic'
            }
          }
        }]
      },
      validators: [
        () => {
          return RSVP.resolve({
            value: {
              errors: [{
                path: '#/'
              }],
              warnings: []
            }
          })
        }
      ],
      plugins: {
        dynamic () {
          return RSVP.resolve({
            model: {
              type: 'object',
              properties: {
                dynamicProperty: {
                  type: 'object',
                  properties: {}
                }
              }
            },
            view: {
              type: 'form',
              version: '2.0',
              cells: [{
                model: 'dynamicProperty',
                renderer: {
                  name: 'form',
                  plugin: {
                    name: 'dynamicNested'
                  }
                }
              }]
            }
          })
        },
        dynamicNested () {
          return RSVP.resolve({
            model: {
              type: 'object',
              properties: {
                dynamicNestedProperty: {
                  type: 'string'
                }
              }
            }
          })
        }
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render', function () {
      expectBunsenTextRendererWithState('dynamic.dynamicProperty.dynamicNestedProperty',
        {label: 'Dynamic nested property'})
    })

    it('should use passed in validators', function () {
      expectOnValidationState(ctx, {
        count: 1,
        errors: [
          {'path': '#/'},
          {'path': '#/dynamic/'},
          {'path': '#/dynamic/dynamicProperty/'}
        ]
      })
    })
  })
})
