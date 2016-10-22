import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {$hook, initialize} from 'ember-hook'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
  TAB: 9
}

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | collapsible',
  {
    integration: true
  },
  function () {
    beforeEach(function () {
      initialize()

      const bunsenModel = {
        properties: {
          bar: {
            type: 'string'
          },
          foo: {
            type: 'string'
          }
        },
        type: 'object'
      }

      const bunsenView = {
        cells: [
          {
            children: [
              {
                model: 'foo'
              },
              {
                collapsible: true,
                label: 'Bar',
                model: 'bar'
              }
            ]
          }
        ],
        type: 'form',
        version: '2.0'
      }

      this.setProperties({
        bunsenModel,
        bunsenView
      })

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
      }}`)
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'renders one collapsible handle'
      )
        .to.have.length(1)

      const $headings = this.$(selectors.bunsen.section.heading)

      expect(
        $headings,
        'renders correct number of headings'
      )
        .to.have.length(1)

      expect(
        $headings.first().text().trim(),
        'renders correct heading text for first input'
      )
        .to.equal('Bar')

      expect(
        this.$(selectors.bunsen.renderer.text),
        'renders two bunsen text inputs'
      )
        .to.have.length(2)

      expect(
        findTextInputs(),
        'renders two text inputs'
      )
        .to.have.length(2)

      expectTextInputWithState('bunsenForm-foo-input', {
        placeholder: '',
        value: ''
      })

      expectTextInputWithState('bunsenForm-bar-input', {
        placeholder: '',
        value: ''
      })
    })

    describe('click handle', function () {
      beforeEach(function () {
        this.$(selectors.bunsen.collapsible.handle).click()
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'renders one collapsible handle'
        )
          .to.have.length(1)

        const $headings = this.$(selectors.bunsen.section.heading)

        expect(
          $headings,
          'renders correct number of headings'
        )
          .to.have.length(1)

        expect(
          $headings.first().text().trim(),
          'renders correct heading text for first input'
        )
          .to.equal('Bar')

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders one bunsen text input'
        )
          .to.have.length(1)

        expect(
          findTextInputs(),
          'renders one text input'
        )
          .to.have.length(1)

        expectTextInputWithState('bunsenForm-foo-input', {
          placeholder: '',
          value: ''
        })
      })
    })

    describe('press enter key while focused on input', function () {
      beforeEach(function () {
        $hook('bunsenForm-foo-input')
          .focus()
          .trigger(
            $.Event('keypress', {
              keyCode: KEY_CODES.ENTER
            })
          )
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'renders one collapsible handle'
        )
          .to.have.length(1)

        const $headings = this.$(selectors.bunsen.section.heading)

        expect(
          $headings,
          'renders correct number of headings'
        )
          .to.have.length(1)

        expect(
          $headings.first().text().trim(),
          'renders correct heading text for first input'
        )
          .to.equal('Bar')

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders two bunsen text inputs'
        )
          .to.have.length(2)

        expect(
          findTextInputs(),
          'renders two text inputs'
        )
          .to.have.length(2)

        expectTextInputWithState('bunsenForm-foo-input', {
          placeholder: '',
          value: ''
        })

        expectTextInputWithState('bunsenForm-bar-input', {
          placeholder: '',
          value: ''
        })
      })
    })

    describe('press enter key while focused on toggle', function () {
      beforeEach(function () {
        $hook('bunsenForm-toggle')
          .focus()
          .trigger(
            $.Event('keypress', {
              keyCode: KEY_CODES.ENTER
            })
          )
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'renders one collapsible handle'
        )
          .to.have.length(1)

        const $headings = this.$(selectors.bunsen.section.heading)

        expect(
          $headings,
          'renders correct number of headings'
        )
          .to.have.length(1)

        expect(
          $headings.first().text().trim(),
          'renders correct heading text for first input'
        )
          .to.equal('Bar')

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders one bunsen text input'
        )
          .to.have.length(1)

        expect(
          findTextInputs(),
          'renders one text input'
        )
          .to.have.length(1)

        expectTextInputWithState('bunsenForm-foo-input', {
          placeholder: '',
          value: ''
        })
      })
    })

    describe('press space key while focused on toggle', function () {
      beforeEach(function () {
        $hook('bunsenForm-toggle')
          .focus()
          .trigger(
            $.Event('keypress', {
              keyCode: KEY_CODES.SPACE
            })
          )
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'renders one collapsible handle'
        )
          .to.have.length(1)

        const $headings = this.$(selectors.bunsen.section.heading)

        expect(
          $headings,
          'renders correct number of headings'
        )
          .to.have.length(1)

        expect(
          $headings.first().text().trim(),
          'renders correct heading text for first input'
        )
          .to.equal('Bar')

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders one bunsen text input'
        )
          .to.have.length(1)

        expect(
          findTextInputs(),
          'renders one text input'
        )
          .to.have.length(1)

        expectTextInputWithState('bunsenForm-foo-input', {
          placeholder: '',
          value: ''
        })
      })
    })

    describe('press other key while focused on toggle', function () {
      beforeEach(function () {
        $hook('bunsenForm-toggle')
          .focus()
          .trigger(
            $.Event('keypress', {
              keyCode: KEY_CODES.TAB
            })
          )
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'renders one collapsible handle'
        )
          .to.have.length(1)

        const $headings = this.$(selectors.bunsen.section.heading)

        expect(
          $headings,
          'renders correct number of headings'
        )
          .to.have.length(1)

        expect(
          $headings.first().text().trim(),
          'renders correct heading text for first input'
        )
          .to.equal('Bar')

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders two bunsen text inputs'
        )
          .to.have.length(2)

        expect(
          findTextInputs(),
          'renders two text inputs'
        )
          .to.have.length(2)

        expectTextInputWithState('bunsenForm-foo-input', {
          placeholder: '',
          value: ''
        })

        expectTextInputWithState('bunsenForm-bar-input', {
          placeholder: '',
          value: ''
        })
      })
    })
  }
)
