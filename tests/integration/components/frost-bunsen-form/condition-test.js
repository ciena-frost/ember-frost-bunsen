import {expect} from 'chai'
import {beforeEach, describe, it} from 'mocha'

import {
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / cell required label', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        qux: {
          type: 'string'
        },
        foo: {
          properties: {
            bar: {
              type: 'string'
            }
          }
        }
      }
    }
  })

  describe('when conditions exists on a leaf property', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenModel: {
          properties: {
            qux: {
              type: 'string'
            },
            foo: {
              properties: {
                bar: {
                  type: 'string',
                  conditions: [
                    {
                      'if': [
                        {
                          '../qux': {
                            'equals': 'hello'
                          }
                        }
                      ]
                    }
                  ]
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        bunsenView: {
          cells: [
            {
              label: 'Test',
              children: [
                {
                  model: 'foo.bar'
                }
              ]
            }
          ],
          type: 'form',
          version: '2.0'
        },
        value: {}
      })
    })

    describe('when the condition is met', function () {
      beforeEach(function () {
        this.set('value', {
          qux: 'hello'
        })
      })

      it('renders as expected', function () {
        expect(
          findTextInputs(),
          'renders one text input'
        )
          .to.have.length(1)
      })
    })

    describe('when the condition is not met', function () {
      beforeEach(function () {
        this.set('value', {
          qux: 'hell'
        })
      })

      it('renders as expected', function () {
        expect(
          findTextInputs(),
          'does not render any text input'
        )
          .to.have.length(0)
      })
    })
  })

  describe('when conditions exist on the parent property', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenModel: {
          properties: {
            qux: {
              type: 'string'
            },
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              conditions: [
                {
                  'if': [
                    {
                      './qux': {
                        'equals': 'hello'
                      }
                    }
                  ]
                }
              ],
              type: 'object'
            }
          },
          type: 'object'
        },
        bunsenView: {
          cells: [
            {
              label: 'Test',
              children: [
                {
                  model: 'foo.bar'
                }
              ]
            }
          ],
          type: 'form',
          version: '2.0'
        },
        value: {}
      })
    })

    describe('when the condition is met', function () {
      beforeEach(function () {
        this.set('value', {
          qux: 'hello'
        })
      })

      it('renders as expected', function () {
        expect(
          findTextInputs(),
          'renders one text input'
        )
          .to.have.length(1)
      })
    })

    describe('when the condition is not met', function () {
      beforeEach(function () {
        this.set('value', {
          qux: 'hell'
        })
      })

      it('renders as expected', function () {
        expect(
          findTextInputs(),
          'does not render any text input'
        )
          .to.have.length(0)
      })
    })
  })
})
