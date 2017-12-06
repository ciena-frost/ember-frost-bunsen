import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'
import {
  expectBunsenPasswordStaticRendererWithState,
  expectCollapsibleHandles} from 'dummy/tests/helpers/ember-frost-bunsen'
import selectors from 'dummy/tests/helpers/selectors'
import {setupDetailComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-detail / renderer / password', function () {
  setupDetailComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          type: 'string'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          model: 'foo',
          renderer: {
            name: 'password'
          }
        }
      ],
      type: 'detail',
      version: '2.0'
    },
    value: {
      foo: 'Baz'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0, 'bunsenDetail')

    expect(
      this.$(selectors.bunsen.renderer.password.input),
      'renders a bunsen password input'
    )
      .to.have.length(1)

    expect(
      this.$(selectors.bunsen.renderer.password.text).text().trim(),
      'does not reveal password'
    )
      .to.equal('************')

    expect(
      this.$(selectors.bunsen.label).text().trim(),
      'renders expected label text'
    )
      .to.equal('Foo')
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo',
            renderer: {
              name: 'password'
            }
          }
        ],
        type: 'detail',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.password.text).text().trim(),
        'does not reveal password'
      )
        .to.equal('************')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('FooBar Baz')
    })
  })

  describe('when collapsible is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: true,
            model: 'foo',
            renderer: {
              name: 'password'
            }
          }
        ],
        type: 'detail',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1, 'bunsenDetail')

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.password.text).text().trim(),
        'does not reveal password'
      )
        .to.equal('************')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when collapsible is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: false,
            model: 'foo',
            renderer: {
              name: 'password'
            }
          }
        ],
        type: 'detail',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.password.text).text().trim(),
        'does not reveal password'
      )
        .to.equal('************')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('user presses reveal icon', function () {
    beforeEach(function () {
      this.$(selectors.bunsen.renderer.password.reveal).click()
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.password.text).text().trim(),
        'reveals password'
      )
        .to.equal('Baz')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })

    describe('user presses reveal icon again', function () {
      beforeEach(function () {
        this.$(selectors.bunsen.renderer.password.reveal).click()
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'bunsenDetail')

        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.bunsen.renderer.password.text).text().trim(),
          'does not reveal password'
        )
          .to.equal('************')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })
  })

  describe('when revealable option is false', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'password',
              options: {
                revealable: false
              }
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectBunsenPasswordStaticRendererWithState('foo', {
        label: 'Foo',
        revealable: false,
        value: '************'
      })
    })
  })

  describe('when revealable option is not provided', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'password',
              options: {}
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectBunsenPasswordStaticRendererWithState('foo', {
        label: 'Foo',
        revealable: true,
        value: '************'
      })
    })
  })
})
