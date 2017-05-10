import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {expectCollapsibleHandles} from 'dummy/tests/helpers/ember-frost-bunsen'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component / frost-bunsen-detail / renderer / image', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  let props, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()

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
              name: 'image'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      },
      value: {
        bar: 'ciena',
        foo: 'http://www.ciena.com/includes/prx-logo.svg'
      }
    }

    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-detail
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      value=value
    }}`)

    return wait()
  })

  afterEach(function () {
    sandbox.restore()
    props = null
    sandbox = null
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0, 'bunsenDetail')

    const $images = this.$(selectors.bunsen.renderer.image)

    expect(
      $images,
      'renders a bunsen image input'
    )
      .to.have.length(1)

    const $img = $images.first().find('img')

    expect(
      $img.prop('src'),
      'image has expected source'
    )
      .to.equal('http://www.ciena.com/includes/prx-logo.svg')

    expect(
      $img.prop('alt'),
      'image has expected alternative text'
    )
      .to.equal('')

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
              name: 'image'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.images)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

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
              name: 'image'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

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
              name: 'image'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when alt option set', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenView: {
          cells: [
            {
              model: 'foo',
              renderer: {
                alt: 'Ciena',
                name: 'image'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        }
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('Ciena')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when alt option set with reference to another property', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenView: {
          cells: [
            {
              model: 'foo',
              renderer: {
                alt: '${./bar}',
                name: 'image'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        }
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('ciena')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when alt option set with reference to property that is not present', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenView: {
          cells: [
            {
              model: 'foo',
              renderer: {
                alt: '${./bar}',
                name: 'image'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        },
        value: {
          foo: 'http://www.ciena.com/includes/prx-logo.svg'
        }
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when alt option set with reference to another property (deep)', function () {
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
                alt: '${./bar}',
                name: 'image'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        },
        value: {
          parent: {
            bar: 'ciena',
            foo: 'http://www.ciena.com/includes/prx-logo.svg'
          }
        }
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://www.ciena.com/includes/prx-logo.svg')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('ciena')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when src option set', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenView: {
          cells: [
            {
              model: 'foo',
              renderer: {
                name: 'image',
                src: 'http://media.ciena.com/designimages/CBP-logo_header_2x.png'
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://media.ciena.com/designimages/CBP-logo_header_2x.png')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when src option set with reference to another property', function () {
    beforeEach(function () {
      this.setProperties({
        bunsenView: {
          cells: [
            {
              model: 'foo',
              renderer: {
                name: 'image',
                src: 'http://media.${./bar}.com/designimages/CBP-logo_header_2x.png'
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://media.ciena.com/designimages/CBP-logo_header_2x.png')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })

  describe('when src option set with reference to another property (deep)', function () {
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
                name: 'image',
                src: 'http://media.${./bar}.com/designimages/CBP-logo_header_2x.png'
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

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

      const $images = this.$(selectors.bunsen.renderer.image)

      expect(
        $images,
        'renders a bunsen image input'
      )
        .to.have.length(1)

      const $img = $images.first().find('img')

      expect(
        $img.prop('src'),
        'image has expected source'
      )
        .to.equal('http://media.ciena.com/designimages/CBP-logo_header_2x.png')

      expect(
        $img.prop('alt'),
        'image has expected alternative text'
      )
        .to.equal('')

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')
    })
  })
})
