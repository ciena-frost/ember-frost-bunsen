import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {expectOnValidationState} from 'dummy/tests/helpers/ember-frost-bunsen'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / cell required label', function () {
  const ctx = setupFormComponentTest({
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
    }
  })

  describe('parent cell does not have model', function () {
    beforeEach(function () {
      this.set('bunsenView', {
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
      })

      return wait()
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

        return wait()
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

        expectOnValidationState(ctx, {count: 1})
      })

      describe('when input is updated', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          $hook('bunsenForm-foo.bar-input').val('b').trigger('input')
          return wait()
        })

        it('should have correct validation state', function () {
          expectOnValidationState(ctx, {count: 1})
        })
      })
    })

    describe('when child is not required but ancenstors are', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
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

        return wait()
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

        expectOnValidationState(ctx, {
          count: 1,
          errors: [
            {
              code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
              params: ['foo'],
              message: 'Field is required.',
              path: '#/foo',
              isRequiredError: true
            }
          ]
        })
      })

      describe('when input is updated to meet requirement', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          $hook('bunsenForm-foo.bar-input').val('b').trigger('input')
          return wait()
        })

        it('should have correct validation state', function () {
          expectOnValidationState(ctx, {count: 1})
        })
      })
    })

    describe('when child and all ancestors are required', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
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

        return wait()
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

        expectOnValidationState(ctx, {
          count: 1,
          errors: [
            {
              code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
              params: ['foo'],
              message: 'Field is required.',
              path: '#/foo',
              isRequiredError: true
            }
          ]
        })
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

        return wait()
      })

      describe('when childs parent is present', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          // NOTE: w/o baz here bunsen-core would strip the value out
          this.set('value', {foo: {baz: 'test'}})
          return wait()
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

          expectOnValidationState(ctx, {
            count: 1,
            errors: [
              {
                code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                params: ['bar'],
                message: 'Field is required.',
                path: '#/foo/bar',
                isRequiredError: true
              }
            ]
          })
        })
      })

      describe('when childs parent is not present', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          this.set('value', {})
          return wait()
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

          expectOnValidationState(ctx, {count: 0})
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

        return wait()
      })

      describe('when parent is not present', function () {
        beforeEach(function () {
          this.set('value', {})
          return wait()
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

          return wait()
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

          return wait()
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

          return wait()
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
      this.set('bunsenView', {
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
      })

      return wait()
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

        return wait()
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

        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('when child is not required but ancenstors are', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
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

        return wait()
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

        expectOnValidationState(ctx, {
          count: 1,
          errors: [
            {
              code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
              params: ['foo'],
              message: 'Field is required.',
              path: '#/foo',
              isRequiredError: true
            }
          ]
        })
      })
    })

    describe('when child and all ancestors are required', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
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

        return wait()
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

        expectOnValidationState(ctx, {
          count: 1,
          errors: [
            {
              code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
              params: ['foo'],
              message: 'Field is required.',
              path: '#/foo',
              isRequiredError: true
            }
          ]
        })
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

        return wait()
      })

      describe('when childs parent is present', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          // NOTE: w/o baz here bunsen-core would strip the value out
          this.set('value', {foo: {baz: 'test'}})
          return wait()
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

          expectOnValidationState(ctx, {
            count: 1,
            errors: [
              {
                code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                params: ['bar'],
                message: 'Field is required.',
                path: '#/foo/bar',
                isRequiredError: true
              }
            ]
          })
        })
      })

      describe('when childs parent is not present', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          this.set('value', {})
          return wait()
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

          expectOnValidationState(ctx, {count: 0})
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

        return wait()
      })

      describe('when parent is not present', function () {
        beforeEach(function () {
          this.set('value', {})
          return wait()
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

          return wait()
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

          return wait()
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

          return wait()
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
})
