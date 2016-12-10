import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-detail | renderer | password', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  let props

  beforeEach(function () {
    props = {
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
    }

    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-detail
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      value=value
    }}`)
  })

  it('renders as expected', function () {
    expect(
      this.$(selectors.bunsen.collapsible.handle),
      'does not render collapsible handle'
    )
      .to.have.length(0)

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'renders collapsible handle'
      )
        .to.have.length(1)

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

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
})
