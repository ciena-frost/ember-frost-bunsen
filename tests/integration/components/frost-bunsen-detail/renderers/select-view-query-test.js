import {expect} from 'chai'
import Ember from 'ember'
const {Logger, RSVP, run} = Ember
import {initialize} from 'ember-hook'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-detail',
  'Integration: Component | frost-bunsen-detail | renderer | select view query',
  {
    integration: true
  },
  function () {
    let promise, props, resolver, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      initialize()
      resolver = {}
      sandbox.stub(Logger, 'log')

      promise = new RSVP.Promise((resolve, reject) => {
        resolver.resolve = resolve
        resolver.reject = reject
      })

      this.register('service:store', Ember.Service.extend({
        query () {
          return promise
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
                  modelType: 'node',
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
        hook: 'my-form',
        onError: sandbox.spy(),
        value: undefined
      }

      this.setProperties(props)

      this.render(hbs`
        {{frost-bunsen-detail
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          hook=hook
          onError=onError
          value=value
        }}
      `)
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('when no initial value', function () {
      beforeEach(function () {
        this.set('value', undefined)
      })

      describe('when query succeeds', function () {
        beforeEach(function () {
          run(() => {
            resolver.resolve([
              Ember.Object.create({
                id: 'bar',
                label: 'Barbeque'
              }),
              Ember.Object.create({
                id: 'baz',
                label: 'Bazzle dazzle'
              })
            ])
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

        describe('when label defined in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  label: 'FooBar Baz',
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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

      describe('when query fails', function () {
        beforeEach(function () {
          run(() => {
            resolver.reject({
              responseJSON: {
                errors: [{
                  detail: 'It done broke, son.'
                }]
              }
            })
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
    })

    describe('when initial value', function () {
      beforeEach(function () {
        this.set('value', {
          foo: 'bar'
        })
      })

      describe('when query succeeds', function () {
        beforeEach(function () {
          run(() => {
            resolver.resolve([
              Ember.Object.create({
                id: 'bar',
                label: 'Barbeque'
              }),
              Ember.Object.create({
                id: 'baz',
                label: 'Bazzle dazzle'
              })
            ])
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

        describe('when label defined in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  label: 'FooBar Baz',
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
          run(() => {
            resolver.reject({
              responseJSON: {
                errors: [{
                  detail: 'It done broke, son.'
                }]
              }
            })
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
                  model: 'foo',
                  renderer: {
                    name: 'select',
                    options: {
                      modelType: 'node',
                      query: {
                        baz: 'alpha'
                      }
                    }
                  }
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
