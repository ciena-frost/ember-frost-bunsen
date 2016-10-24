import {expect} from 'chai'
import Ember from 'ember'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | link',
  {
    integration: true
  },
  function () {
    let props, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      // This is necessary so link-to will still generate a proper "href" for
      // anchor tag
      this.registry.register('service:-routing', Ember.Object.extend({
        hasRoute: (name) => true,
        isActiveForRoute: () => true,
        generateURL: (route, id) => `/#/${route}/${id}`
      }))

      props = {
        bunsenModel: {
          properties: {
            bar: {
              type: 'string'
            },
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
                name: 'link'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        },
        value: {
          bar: 'ciena',
          foo: 'http://ciena.com/'
        }
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        value=value
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

      const $links = this.$(selectors.bunsen.renderer.link)

      expect(
        $links,
        'renders a bunsen link input'
      )
        .to.have.length(1)

      const $a = $links.first().find('a')

      expect(
        $a.prop('href'),
        'link has expected URL'
      )
        .to.equal('http://ciena.com/')

      expect(
        $a.text().trim(),
        'link has expected text'
      )
        .to.equal('http://ciena.com/')

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
                name: 'link'
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

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('http://ciena.com/')

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
                name: 'link'
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

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('http://ciena.com/')

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
                name: 'link'
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

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('http://ciena.com/')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when label option set', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenView: {
            cells: [
              {
                model: 'foo',
                renderer: {
                  label: 'Ciena',
                  name: 'link'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('Ciena')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when label option set with reference to another property', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenView: {
            cells: [
              {
                model: 'foo',
                renderer: {
                  label: '${./bar}',
                  name: 'link'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('ciena')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when label option set with reference to another property (deep)', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenModel: {
            properties: {
              parent: {
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
            },
            type: 'object'
          },
          bunsenView: {
            cells: [
              {
                model: 'parent.foo',
                renderer: {
                  label: '${./bar}',
                  name: 'link'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          },
          value: {
            parent: {
              bar: 'ciena',
              foo: 'http://ciena.com/'
            }
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('ciena')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when route option set', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenView: {
            cells: [
              {
                model: 'foo',
                renderer: {
                  name: 'link',
                  route: 'tutorial'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          },
          value: {
            foo: 'models'
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          /\/#\/tutorial\/models$/.test($a.prop('href')),
          'link has expected URL'
        )
          .to.equal(true)

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('models')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when url option set', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenView: {
            cells: [
              {
                model: 'foo',
                renderer: {
                  name: 'link',
                  url: 'http://blueplanet.com/'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          },
          value: {
            foo: 'blueplanet'
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://blueplanet.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('blueplanet')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when url option set with reference to another property', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenView: {
            cells: [
              {
                model: 'foo',
                renderer: {
                  name: 'link',
                  url: 'http://${./bar}.com/'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          },
          value: {
            bar: 'ciena',
            foo: 'Ciena Corporation'
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('Ciena Corporation')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })

    describe('when url option set with reference to another property (deep)', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenModel: {
            properties: {
              parent: {
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
            },
            type: 'object'
          },
          bunsenView: {
            cells: [
              {
                model: 'parent.foo',
                renderer: {
                  name: 'link',
                  url: 'http://${./bar}.com/'
                }
              }
            ],
            type: 'form',
            version: '2.0'
          },
          value: {
            parent: {
              bar: 'ciena',
              foo: 'Ciena Corporation'
            }
          }
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        const $links = this.$(selectors.bunsen.renderer.link)

        expect(
          $links,
          'renders a bunsen link input'
        )
          .to.have.length(1)

        const $a = $links.first().find('a')

        expect(
          $a.prop('href'),
          'link has expected URL'
        )
          .to.equal('http://ciena.com/')

        expect(
          $a.text().trim(),
          'link has expected text'
        )
          .to.equal('Ciena Corporation')

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Foo')
      })
    })
  }
)
