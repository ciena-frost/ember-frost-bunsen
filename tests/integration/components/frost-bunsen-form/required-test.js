import {expect} from 'chai'
import {initialize} from 'ember-hook'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | cell required label',
  {
    integration: true
  },
  function () {
    let props, sandbox

    beforeEach(function () {
      initialize()
      sandbox = sinon.sandbox.create()

      props = {
        bunsenModel: {
          properties: {
            foo: {
              properties: {
                bar: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onChange: sandbox.spy(),
        onValidation: sandbox.spy(),
        value: undefined
      }
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('parent cell does not have model', function () {
      beforeEach(function () {
        props.bunsenView = {
          cells: [
            {
              children: [
                {
                  model: 'foo.bar'
                }
              ],
              label: 'Foo'
            }
          ],
          type: 'form',
          version: '2.0'
        }

        this.setProperties(props)

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          onChange=onChange
          onValidation=onValidation
          value=value
        }}`)
      })

      describe('when child and ancestors are not required', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                type: 'object'
              }
            },
            type: 'object'
          })
        })

        it('renders as expected', function () {
          const $headings = this.$(selectors.bunsen.section.heading)

          expect(
            $headings,
            'renders a cell heading'
          )
            .to.have.length(1)

          const headingText = $headings
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            headingText,
            'renders expected heading text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.section.required),
            'does not render required text in heading'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo.bar-input', {
            placeholder: ''
          })

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Bar')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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

      describe('when child is not required but ancenstors are', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                type: 'object'
              }
            },
            required: ['foo'],
            type: 'object'
          })
        })

        it('renders as expected', function () {
          const $headings = this.$(selectors.bunsen.section.heading)

          expect(
            $headings,
            'renders a cell heading'
          )
            .to.have.length(1)

          const headingText = $headings
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            headingText,
            'renders expected heading text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.section.required),
            'does not render required text in heading'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo.bar-input', {
            placeholder: ''
          })

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Bar')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(3)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(1)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
        })
      })

      describe('when child and all ancestors are required', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                required: ['bar'],
                type: 'object'
              }
            },
            required: ['foo'],
            type: 'object'
          })
        })

        it('renders as expected', function () {
          const $headings = this.$(selectors.bunsen.section.heading)

          expect(
            $headings,
            'renders a cell heading'
          )
            .to.have.length(1)

          const headingText = $headings
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            headingText,
            'renders expected heading text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.section.required),
            'renders required text in heading'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo.bar-input', {
            placeholder: ''
          })

          const label = this.$(selectors.bunsen.label)
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            label,
            'renders expected label text'
          )
            .to.equal('Bar')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(3)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(1)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
        })
      })

      describe('when child is required but not all ancestors are required', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                required: ['bar'],
                type: 'object'
              }
            },
            type: 'object'
          })
        })

        describe('when childs parent is present', function () {
          beforeEach(function () {
            // NOTE: w/o baz here bunsen-core would strip the value out
            this.set('value', {foo: {baz: 'test'}})
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input'
            )
              .to.have.length(1)

            expect(
              findTextInputs(),
              'renders one text input'
            )
              .to.have.length(1)

            expectTextInputWithState('bunsenForm-foo.bar-input', {
              placeholder: ''
            })

            const label = this.$(selectors.bunsen.label)
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              label,
              'renders expected label text'
            )
              .to.equal('Bar')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(3)

            const validationResult = props.onValidation.lastCall.args[0]

            expect(
              validationResult.errors.length,
              'informs consumer there are no errors'
            )
              .to.equal(1)

            expect(
              validationResult.warnings.length,
              'informs consumer there are no warnings'
            )
              .to.equal(0)
          })
        })

        describe('when childs parent is not present', function () {
          beforeEach(function () {
            this.set('value', {})
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.section.required),
              'does not render required text in heading'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input'
            )
              .to.have.length(1)

            expect(
              findTextInputs(),
              'renders one text input'
            )
              .to.have.length(1)

            expectTextInputWithState('bunsenForm-foo.bar-input', {
              placeholder: ''
            })

            const label = this.$(selectors.bunsen.label)
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              label,
              'renders expected label text'
            )
              .to.equal('Bar')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(1)

            const validationResult = props.onValidation.lastCall.args[0]

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
      })

      describe('complex case', function () {
        beforeEach(function () {
          this.setProperties({
            bunsenModel: {
              properties: {
                foo: {
                  properties: {
                    bar: {
                      type: 'string'
                    },
                    baz: {
                      type: 'string'
                    }
                  },
                  required: ['bar'],
                  type: 'object'
                }
              },
              required: ['foo'],
              type: 'object'
            },
            bunsenView: {
              cells: [
                {
                  label: 'Test',
                  children: [
                    {
                      model: 'foo.bar'
                    },
                    {
                      model: 'foo.baz'
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

        describe('when parent is not present', function () {
          beforeEach(function () {
            this.set('value', {})
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)
          })
        })

        describe('when parent is present', function () {
          beforeEach(function () {
            this.set('value', {
              foo: {}
            })
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)
          })
        })

        describe('when required child is present', function () {
          beforeEach(function () {
            this.set('value', {
              foo: {
                bar: 'test'
              }
            })
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'does not render required text in heading'
            )
              .to.have.length(0)
          })
        })

        describe('when non-required child is present', function () {
          beforeEach(function () {
            this.set('value', {
              foo: {
                baz: 'test'
              }
            })
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)
          })
        })
      })
    })

    describe('parent cell has model', function () {
      beforeEach(function () {
        props.bunsenView = {
          cells: [
            {
              children: [
                {
                  model: 'bar'
                }
              ],
              label: 'Foo',
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        }

        this.setProperties(props)

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          onChange=onChange
          onValidation=onValidation
          value=value
        }}`)
      })

      describe('when child and ancestors are not required', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                type: 'object'
              }
            },
            type: 'object'
          })
        })

        it('renders as expected', function () {
          const $headings = this.$(selectors.bunsen.section.heading)

          expect(
            $headings,
            'renders a cell heading'
          )
            .to.have.length(1)

          const headingText = $headings
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            headingText,
            'renders expected heading text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.section.required),
            'does not render required text in heading'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo.bar-input', {
            placeholder: ''
          })

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Bar')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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

      describe('when child is not required but ancenstors are', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                type: 'object'
              }
            },
            required: ['foo'],
            type: 'object'
          })
        })

        it('renders as expected', function () {
          const $headings = this.$(selectors.bunsen.section.heading)

          expect(
            $headings,
            'renders a cell heading'
          )
            .to.have.length(1)

          const headingText = $headings
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            headingText,
            'renders expected heading text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.section.required),
            'does not render required text in heading'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo.bar-input', {
            placeholder: ''
          })

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Bar')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(3)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(1)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
        })
      })

      describe('when child and all ancestors are required', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                required: ['bar'],
                type: 'object'
              }
            },
            required: ['foo'],
            type: 'object'
          })
        })

        it('renders as expected', function () {
          const $headings = this.$(selectors.bunsen.section.heading)

          expect(
            $headings,
            'renders a cell heading'
          )
            .to.have.length(1)

          const headingText = $headings
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            headingText,
            'renders expected heading text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.section.required),
            'renders required text in heading'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo.bar-input', {
            placeholder: ''
          })

          const label = this.$(selectors.bunsen.label)
            .clone().children().remove().end() // Remove required DOM to get just the heading
            .text().trim()

          expect(
            label,
            'renders expected label text'
          )
            .to.equal('Bar')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(3)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(1)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
        })
      })

      describe('when child is required but not all ancestors are required', function () {
        beforeEach(function () {
          this.set('bunsenModel', {
            properties: {
              foo: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                required: ['bar'],
                type: 'object'
              }
            },
            type: 'object'
          })
        })

        describe('when childs parent is present', function () {
          beforeEach(function () {
            // NOTE: w/o baz here bunsen-core would strip the value out
            this.set('value', {foo: {baz: 'test'}})
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input'
            )
              .to.have.length(1)

            expect(
              findTextInputs(),
              'renders one text input'
            )
              .to.have.length(1)

            expectTextInputWithState('bunsenForm-foo.bar-input', {
              placeholder: ''
            })

            const label = this.$(selectors.bunsen.label)
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              label,
              'renders expected label text'
            )
              .to.equal('Bar')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(3)

            const validationResult = props.onValidation.lastCall.args[0]

            expect(
              validationResult.errors.length,
              'informs consumer there are no errors'
            )
              .to.equal(1)

            expect(
              validationResult.warnings.length,
              'informs consumer there are no warnings'
            )
              .to.equal(0)
          })
        })

        describe('when childs parent is not present', function () {
          beforeEach(function () {
            this.set('value', {})
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.section.required),
              'does not render required text in heading'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input'
            )
              .to.have.length(1)

            expect(
              findTextInputs(),
              'renders one text input'
            )
              .to.have.length(1)

            expectTextInputWithState('bunsenForm-foo.bar-input', {
              placeholder: ''
            })

            const label = this.$(selectors.bunsen.label)
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              label,
              'renders expected label text'
            )
              .to.equal('Bar')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(1)

            const validationResult = props.onValidation.lastCall.args[0]

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
      })

      describe('complex case', function () {
        beforeEach(function () {
          this.setProperties({
            bunsenModel: {
              properties: {
                foo: {
                  properties: {
                    bar: {
                      type: 'string'
                    },
                    baz: {
                      type: 'string'
                    }
                  },
                  required: ['bar'],
                  type: 'object'
                }
              },
              required: ['foo'],
              type: 'object'
            },
            bunsenView: {
              cells: [
                {
                  label: 'Test',
                  model: 'foo',
                  children: [
                    {
                      model: 'bar'
                    },
                    {
                      model: 'baz'
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

        describe('when parent is not present', function () {
          beforeEach(function () {
            this.set('value', {})
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)
          })
        })

        describe('when parent is present', function () {
          beforeEach(function () {
            this.set('value', {
              foo: {}
            })
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)
          })
        })

        describe('when required child is present', function () {
          beforeEach(function () {
            this.set('value', {
              foo: {
                bar: 'test'
              }
            })
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'does not render required text in heading'
            )
              .to.have.length(0)
          })
        })

        describe('when non-required child is present', function () {
          beforeEach(function () {
            this.set('value', {
              foo: {
                baz: 'test'
              }
            })
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'renders a cell heading'
            )
              .to.have.length(1)

            const headingText = $headings
              .clone().children().remove().end() // Remove required DOM to get just the heading
              .text().trim()

            expect(
              headingText,
              'renders expected heading text'
            )
              .to.equal('Test')

            expect(
              this.$(selectors.bunsen.section.required),
              'renders required text in heading'
            )
              .to.have.length(1)
          })
        })
      })
    })
  }
)
