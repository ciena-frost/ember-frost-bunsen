import {expect} from 'chai'
import Ember from 'ember'
import {$hook} from 'ember-hook'
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

  describe('dynamic and nested with initial value', function () {
    setupFormComponentTest({
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
                  type: 'object'
                },
                reference: {
                  type: 'string'
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
                    name: 'dynamicNested',
                    args: {
                      reference: '${./reference}'
                    }
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
      },
      value: {
        dynamic: {
          dynamicProperty: {
            dynamicNestedProperty: 'hello'
          },
          reference: 'foo'
        }
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render', function () {
      expectBunsenTextRendererWithState('dynamic.dynamicProperty.dynamicNestedProperty',
        {
          label: 'Dynamic nested property',
          value: 'hello'
        })
    })
  })

  describe('dynamic inside arrays', function () {
    let ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          dynamic: {
            type: 'array',
            items: {
              type: 'object',
              properties: {}
            }
          }
        },
        type: 'object'
      },
      bunsenView: {
        type: 'form',
        version: '2.0',
        cells: [{
          model: 'dynamic',
          arrayOptions: {
            itemCell: {
              renderer: {
                name: 'form',
                plugin: {
                  name: 'dynamic'
                }
              }
            }
          }
        }]
      },
      plugins: {
        dynamic () {
          return RSVP.resolve({
            model: {
              type: 'object',
              required: ['dynamicProperty'],
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

    describe('after adding', function () {
      beforeEach(function () {
        $hook('bunsenForm-addBtn').click()
        return wait()
      })

      it('should render', function () {
        expectBunsenTextRendererWithState('dynamic.0.dynamicProperty',
          {
            label: 'Dynamic property',
            required: true
          })
      })

      it('should validate', function () {
        expectOnValidationState(ctx, {
          count: 1,
          errors: [{
            'code': 'OBJECT_MISSING_REQUIRED_PROPERTY',
            'params': ['dynamicProperty'],
            'message': 'Field is required.',
            'path': '#/dynamic/0/dynamicProperty',
            'isRequiredError': true
          }]
        })
      })

      describe('after removing', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          $hook('bunsenForm-removeBtn').click()
          return wait()
        })

        it('should render', function () {
          expect($hook('bunsenForm-removeBtn').length).to.equal(0)
        })

        it('should validate', function () {
          expectOnValidationState(ctx, {
            count: 1,
            errors: [],
            warnings: []
          })
        })
      })
    })
  })
})
