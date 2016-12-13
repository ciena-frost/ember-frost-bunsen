import {expect} from 'chai'
import Ember from 'ember'
const {Logger, RSVP} = Ember
import {initialize} from 'ember-hook'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import selectors from 'dummy/tests/helpers/selectors'

const TEST_TEMPLATE = hbs`
  {{frost-bunsen-detail
    bunsenModel=bunsenModel
    bunsenView=bunsenView
    hook=hook
    onError=onError
    value=value
    store=store
  }}
`

describeComponent(
  'frost-bunsen-detail',
  'Integration: Component - frost-bunsen-detail - renderer - select model query',
  {
    integration: true
  },
  function () {
    let promise, props, resolver, sandbox, fakeStore

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      initialize()
      resolver = {}
      sandbox.stub(Logger, 'log')

      promise = new RSVP.Promise((resolve, reject) => {
        resolver.resolve = resolve
        resolver.reject = reject
      })

      fakeStore = {
        queryRecord: sinon.stub().returns(promise),
        findRecord: sinon.stub().returns(promise)
      }

      this.register('service:store', Ember.Service.extend(fakeStore))

      props = {
        bunsenModel: {
          properties: {
            foo: {
              modelType: 'node',
              query: {
                baz: 'alpha'
              },
              type: 'string'
            }
          },
          type: 'object'
        },
        bunsenView: undefined,
        hook: 'my-form',
        onError: sandbox.spy(),
        value: undefined
      }

      this.setProperties(props)
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('when no initial value is set', function () {
      beforeEach(function () {
        this.set('value', undefined)
        this.render(TEST_TEMPLATE)
      })

      it('store is not queried', function () {
        expect(fakeStore.queryRecord.called).to.equal(false)
        expect(fakeStore.findRecord.called).to.equal(false)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.bunsen.renderer.static),
          'renders a bunsen static input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')

        expect(
          this.$(selectors.bunsen.value).text().trim(),
          'renders expected value'
        )
          .to.equal('—')
      })

      describe('when label defined in view', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                label: 'FooBar Baz',
                model: 'foo'
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
            this.$(selectors.bunsen.renderer.static),
            'renders a bunsen static input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('FooBar Baz')

          expect(
            this.$(selectors.bunsen.value).text().trim(),
            'renders expected value'
          )
            .to.equal('—')
        })
      })

      describe('when collapsible is set to true in view', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                collapsible: true,
                model: 'foo'
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
            this.$(selectors.bunsen.renderer.static),
            'renders a bunsen static input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.value).text().trim(),
            'renders expected value'
          )
            .to.equal('—')
        })
      })

      describe('when collapsible is set to false in view', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                collapsible: false,
                model: 'foo'
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
            this.$(selectors.bunsen.renderer.static),
            'renders a bunsen static input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.value).text().trim(),
            'renders expected value'
          )
            .to.equal('—')
        })
      })
    })

    describe('when initial value is set', function () {
      beforeEach(function () {
        this.set('value', {
          foo: 'bar'
        })
      })
      describe('if the value attribute is not id', function () {
        beforeEach(function () {
          this.set('bunsenModel.properties.foo.valueAttribute', 'notId')
          this.render(TEST_TEMPLATE)
        })
        it('queries for a record', function () {
          expect(fakeStore.queryRecord.called).to.equal(true)
          expect(fakeStore.findRecord.called).to.equal(false)
        })
      })

      describe('if the value attribute is id', function () {
        beforeEach(function () {
          this.render(TEST_TEMPLATE)
        })
        it('finds the record', function () {
          expect(fakeStore.queryRecord.called).to.equal(false)
          expect(fakeStore.findRecord.called).to.equal(true)
        })
      })

      describe('when query succeeds', function () {
        beforeEach(function () {
          resolver.resolve(Ember.Object.create({
            id: 'bar',
            label: 'Barbeque'
          }))
          this.render(TEST_TEMPLATE)
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.static),
            'renders a bunsen static input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.value).text().trim(),
            'renders expected value'
          )
            .to.equal('Barbeque')
        })

        describe('when label defined in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  label: 'FooBar Baz',
                  model: 'foo'
                }
              ],
              type: 'form',
              version: '2.0'
            })

            return promise
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.collapsible.handle),
              'does not render collapsible handle'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.renderer.static),
              'renders a bunsen static input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('FooBar Baz')

            expect(
              this.$(selectors.bunsen.value).text().trim(),
              'renders expected value'
            )
              .to.equal('Barbeque')
          })
        })

        describe('when collapsible is set to true in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  collapsible: true,
                  model: 'foo'
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
              this.$(selectors.bunsen.renderer.static),
              'renders a bunsen static input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.value).text().trim(),
              'renders expected value'
            )
              .to.equal('Barbeque')
          })
        })

        describe('when collapsible is set to false in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  collapsible: false,
                  model: 'foo'
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
              this.$(selectors.bunsen.renderer.static),
              'renders a bunsen static input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.value).text().trim(),
              'renders expected value'
            )
              .to.equal('Barbeque')
          })
        })
      })

      describe('when query fails', function () {
        beforeEach(function () {
          resolver.reject({
            responseJSON: {
              errors: [{
                detail: 'It done broke, son.'
              }]
            }
          })
          this.render(TEST_TEMPLATE)
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.static),
            'renders a bunsen static input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.label).text().trim(),
            'renders expected label text'
          )
            .to.equal('Foo')

          expect(
            this.$(selectors.bunsen.value).text().trim(),
            'renders expected value'
          )
            .to.equal('bar')

          expect(
            this.get('onError').lastCall.args,
            'calls onError'
          )
            .to.eql(['foo', [{
              path: 'foo',
              message: 'It done broke, son.'
            }]])
        })

        describe('when label defined in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  label: 'FooBar Baz',
                  model: 'foo'
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
              this.$(selectors.bunsen.renderer.static),
              'renders a bunsen static input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('FooBar Baz')

            expect(
              this.$(selectors.bunsen.value).text().trim(),
              'renders expected value'
            )
              .to.equal('bar')
          })
        })

        describe('when collapsible is set to true in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  collapsible: true,
                  model: 'foo'
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
              this.$(selectors.bunsen.renderer.static),
              'renders a bunsen static input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.value).text().trim(),
              'renders expected value'
            )
              .to.equal('bar')
          })
        })

        describe('when collapsible is set to false in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  collapsible: false,
                  model: 'foo'
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
              this.$(selectors.bunsen.renderer.static),
              'renders a bunsen static input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.bunsen.value).text().trim(),
              'renders expected value'
            )
              .to.equal('bar')
          })
        })
      })
    })
  }
)
