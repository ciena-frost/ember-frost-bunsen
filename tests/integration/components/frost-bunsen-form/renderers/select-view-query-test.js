import {expect} from 'chai'
import Ember from 'ember'
const {RSVP} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | select view query',
  {
    integration: true
  },
  function () {
    let props, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      this.register('service:store', Ember.Service.extend({
        query () {
          return RSVP.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 'bar'
            }),
            Ember.Object.create({
              label: 'baz',
              value: 'baz'
            })
          ])
        }
      }))

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
                name: 'select',
                options: {
                  modelType: 'bar',
                  query: {
                    baz: 'alpha'
                  }
                }
              }
            }
          ],
          type: 'form',
          version: '2.0'
        },
        disabled: undefined,
        onChange: sandbox.spy(),
        onValidation: sandbox.spy(),
        showAllErrors: undefined
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        disabled=disabled
        onChange=onChange
        onValidation=onValidation
        showAllErrors=showAllErrors
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.select.input),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.select.input.enabled)

      expect(
        $input,
        'renders an enabled select input'
      )
        .to.have.length(1)

      expect(
        $input.prop('placeholder'),
        'does not have placeholder text'
      )
        .to.equal('')

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

    describe('when expanded/opened', function () {
      beforeEach(function () {
        this.$(selectors.bunsen.renderer.select.arrow).click()
      })

      it('renders as expected', function () {
        const $items = this.$(selectors.bunsen.renderer.select.items)

        expect(
          $items,
          'has correct number of options'
        )
          .to.have.length(2)

        const $firstItem = $items.eq(0)

        expect(
          $firstItem.text().trim(),
          'first item has expected text'
        )
          .to.equal('bar')

        const $secondItem = $items.eq(1)

        expect(
          $secondItem.text().trim(),
          'second item has expected text'
        )
          .to.equal('baz')
      })
    })
  }
)
