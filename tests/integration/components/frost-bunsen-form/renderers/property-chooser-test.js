import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | property-chooser',
  {
    integration: true
  },
  function () {
    let sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      sandbox.stub(Logger, 'warn', () => {})

      this.setProperties({
        bunsenModel: {
          properties: {
            foo: {
              dependencies: {
                useBar: {
                  properties: {
                    name: {type: 'string'}
                  },
                  type: 'object'
                },
                useBaz: {
                  properties: {
                    title: {type: 'string'}
                  },
                  type: 'object'
                }
              },
              properties: {
                useBar: {type: 'string'},
                useBaz: {type: 'string'}
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        bunsenView: {
          cellDefinitions: {
            main: {
              children: [
                {
                  model: 'foo',
                  renderer: {
                    choices: [
                      {
                        label: 'Bar',
                        value: 'useBar'
                      },
                      {
                        label: 'Baz',
                        value: 'useBaz'
                      }
                    ],
                    name: 'property-chooser'
                  }
                },
                {
                  dependsOn: 'foo.useBar',
                  model: 'foo.name'
                },
                {
                  dependsOn: 'foo.useBaz',
                  model: 'foo.title'
                }
              ]
            }
          },
          cells: [
            {
              extends: 'main',
              label: 'Main'
            }
          ],
          type: 'form',
          version: '2.0'
        },
        disabled: undefined,
        onChange: sandbox.spy(),
        onValidation: sandbox.spy()
      })

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        disabled=disabled
        onChange=onChange
        onValidation=onValidation
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.propertyChooser),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.select.input.enabled),
        'renders an enabled select input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.select.input.enabled),
          'renders an enabled select input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })
    })

    describe('when form disabled', function () {
      beforeEach(function () {
        this.set('disabled', true)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.select.input.disabled),
          'renders a disabled select input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })
    })

    describe('when property explicitly enabled in view', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cellDefinitions: {
            main: {
              children: [
                {
                  disabled: false,
                  model: 'foo',
                  renderer: {
                    choices: [
                      {
                        label: 'Bar',
                        value: 'useBar'
                      },
                      {
                        label: 'Baz',
                        value: 'useBaz'
                      }
                    ],
                    name: 'property-chooser'
                  }
                },
                {
                  dependsOn: 'foo.useBar',
                  model: 'foo.name'
                },
                {
                  dependsOn: 'foo.useBaz',
                  model: 'foo.title'
                }
              ]
            }
          },
          cells: [
            {
              extends: 'main',
              label: 'Main'
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.select.input.enabled),
          'renders an enabled select input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })
    })

    describe('when property disabled in view', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cellDefinitions: {
            main: {
              children: [
                {
                  disabled: true,
                  model: 'foo',
                  renderer: {
                    choices: [
                      {
                        label: 'Bar',
                        value: 'useBar'
                      },
                      {
                        label: 'Baz',
                        value: 'useBaz'
                      }
                    ],
                    name: 'property-chooser'
                  }
                },
                {
                  dependsOn: 'foo.useBar',
                  model: 'foo.name'
                },
                {
                  dependsOn: 'foo.useBaz',
                  model: 'foo.title'
                }
              ]
            }
          },
          cells: [
            {
              extends: 'main',
              label: 'Main'
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.select.input.disabled),
          'renders a disabled select input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })
    })
  }
)
