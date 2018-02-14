import {expect} from 'chai'

import {expectCollapsibleHandles} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'
import Ember from 'ember'
const {$} = Ember
import {
  expectWithState as expectTextInputWithState,
  find as findTextInputs
} from 'ember-frost-core/test-support/frost-text'
import {$hook, initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
  TAB: 9
}

describe('Integration: Component / frost-bunsen-form / collapsible', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

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

    return wait()
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(1)

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
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)

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
    })

    it('hides section body', function () {
      expect(
        this.$(selectors.bunsen.section.body).is(':visible')
      ).to.equal(false)
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)

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

    it('doesn\'t hide section body', function () {
      expect(
        this.$(selectors.bunsen.section.body).is(':visible')
      ).to.equal(true)
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)

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
    })

    it('hides section body', function () {
      expect(
        this.$(selectors.bunsen.section.body).is(':visible')
      ).to.equal(false)
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)

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
        'renders two text input'
      )
        .to.have.length(2)

      expectTextInputWithState('bunsenForm-foo-input', {
        placeholder: '',
        value: ''
      })
    })

    it('hides section body', function () {
      expect(
        this.$(selectors.bunsen.section.body).is(':visible')
      ).to.equal(false)
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)

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

    it('doesn\'t hide section body', function () {
      expect(
        this.$(selectors.bunsen.section.body).is(':visible')
      ).to.equal(true)
    })
  })
})
