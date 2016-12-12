import {expect} from 'chai'
import {expectSelectWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {$hook} from 'ember-hook'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: Component / frost-bunsen-form / renderer / property-chooser', function () {
  const ctx = setupFormComponentTest({
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
          extends: 'main'
        }
      ],
      type: 'form',
      version: '2.0'
    },
    hook: 'my-form'
  })

  it('renders as expected', function () {
    expect(
      this.$(selectors.bunsen.collapsible.handle),
      'does not render collapsible handle'
    )
      .to.have.length(0)

    expect(
      this.$(selectors.bunsen.renderer.propertyChooser),
      'renders a bunsen select input'
    )
      .to.have.length(1)

    expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
      text: ''
    })

    expect(
      this.$(selectors.bunsen.label).text().trim(),
      'renders expected label text'
    )
      .to.equal('Foo')

    expect(
      this.$(selectors.error),
      'does not have any validation errors'
    )
      .to.have.length(0)
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cellDefinitions: {
          main: {
            children: [
              {
                label: 'FooBar Baz',
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
            extends: 'main'
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.propertyChooser),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('FooBar Baz')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when collapsible is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cellDefinitions: {
          main: {
            children: [
              {
                collapsible: true,
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
            extends: 'main'
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'renders collapsible handle'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.propertyChooser),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when collapsible is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cellDefinitions: {
          main: {
            children: [
              {
                collapsible: false,
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
            extends: 'main'
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.propertyChooser),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when placeholder defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cellDefinitions: {
          main: {
            children: [
              {
                model: 'foo',
                placeholder: 'Foo bar',
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
            extends: 'main'
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.propertyChooser),
        'renders a bunsen property-chooser input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: 'Foo bar'
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expect(
        ctx.props.onValidation.callCount,
        'informs consumer of validation results'
      )
        .to.equal(1)

      const validationResult = ctx.props.onValidation.lastCall.args[0]

      expect(
        validationResult.errors.length,
        'informs consumer there are no errors'
      )
        .to.equal(0)

      expect(
        validationResult.warnings.length,
        'informs consumer there are no warnings'
      )
        .to.equal(0)
    })
  })

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

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
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        disabled: true,
        text: ''
      })

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
            extends: 'main'
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

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
            extends: 'main'
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        disabled: true,
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })
})
