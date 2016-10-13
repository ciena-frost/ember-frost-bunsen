import {expect} from 'chai'

import {
  generateFacetCell,
  generateFacetView,
  generateLabelFromModel,
  isRegisteredEmberDataModel,
  isRequired
} from 'ember-frost-bunsen/utils'

import {beforeEach, describe, it} from 'mocha'

describe('bunsen-utils', function () {
  describe('generateFacetCell()', function () {
    let facet

    beforeEach(function () {
      facet = {model: 'foo'}
    })

    describe('when renderer defined', function () {
      beforeEach(function () {
        facet.renderer = {name: 'multi-select'}
      })

      describe('when label defined', function () {
        beforeEach(function () {
          facet.label = 'Bar'
        })

        it('returns expected cell', function () {
          const actual = generateFacetCell(facet)
          expect(actual).to.eql({
            children: [
              {
                model: 'foo',
                renderer: {
                  name: 'multi-select'
                }
              }
            ],
            clearable: false,
            collapsible: true,
            label: 'Bar'
          })
        })
      })

      describe('when label not defined', function () {
        it('returns expected cell', function () {
          const actual = generateFacetCell(facet)
          expect(actual).to.eql({
            children: [
              {
                model: 'foo',
                renderer: {
                  name: 'multi-select'
                }
              }
            ],
            clearable: false,
            collapsible: true,
            label: 'Foo'
          })
        })
      })
    })

    describe('when renderer not defined', function () {
      describe('when label defined', function () {
        beforeEach(function () {
          facet.label = 'Bar'
        })

        it('returns expected cell', function () {
          const actual = generateFacetCell(facet)
          expect(actual).to.eql({
            children: [
              {
                model: 'foo'
              }
            ],
            clearable: true,
            collapsible: true,
            label: 'Bar'
          })
        })
      })

      describe('when label not defined', function () {
        it('returns expected cell', function () {
          const actual = generateFacetCell(facet)
          expect(actual).to.eql({
            children: [
              {
                model: 'foo'
              }
            ],
            clearable: true,
            collapsible: true,
            label: 'Foo'
          })
        })
      })
    })
  })

  describe('generateFacetView()', function () {
    let facets

    beforeEach(function () {
      facets = [
        {
          model: 'foo'
        },
        {
          label: 'Bar baz',
          model: 'bar'
        },
        {
          model: 'foo.bar.baz',
          renderer: {
            name: 'multi-select'
          }
        }
      ]
    })

    it('returns expected bunsen view', function () {
      const actual = generateFacetView(facets)
      expect(actual).to.eql({
        cells: [
          {
            children: [
              {
                children: [
                  {
                    model: 'foo'
                  }
                ],
                clearable: true,
                collapsible: true,
                label: 'Foo'
              },
              {
                children: [
                  {
                    model: 'bar'
                  }
                ],
                clearable: true,
                collapsible: true,
                label: 'Bar baz'
              },
              {
                children: [
                  {
                    model: 'foo.bar.baz',
                    renderer: {
                      name: 'multi-select'
                    }
                  }
                ],
                clearable: false,
                collapsible: true,
                label: 'Baz'
              }
            ]
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })
  })

  describe('generateLabelFromModel()', function () {
    it('returns expected label when model is single word and root level property', function () {
      const actual = generateLabelFromModel('foo')
      expect(actual).to.equal('Foo')
    })

    it('returns expected label when model is single word and nested property', function () {
      const actual = generateLabelFromModel('foo.bar')
      expect(actual).to.equal('Bar')
    })

    it('returns expected label when model is camelCase and root level property', function () {
      const actual = generateLabelFromModel('fooBar')
      expect(actual).to.equal('Foo bar')
    })

    it('returns expected label when model is camelCase and nested property', function () {
      const actual = generateLabelFromModel('foo.barBaz')
      expect(actual).to.equal('Bar baz')
    })
  })

  describe('isRegisteredEmberDataModel()', function () {
    let owner

    beforeEach(function () {
      owner = {}
    })

    it('returns true when modelType is registered with Ember Data', function () {
      ;[
        'country',
        'model',
        'node',
        'resource',
        'value',
        'view'
      ]
        .forEach((modelType) => {
          expect(isRegisteredEmberDataModel(owner, modelType)).to.equal(true)
        })
    })

    it('returns false when modelType is not registered with Ember Data', function () {
      expect(isRegisteredEmberDataModel(owner, 'foo-bar')).to.equal(false)
    })
  })

  describe('isRequired()', function () {
    let bunsenModel

    beforeEach(function () {
      bunsenModel = {
        properties: {
          alpha: {type: 'string'},
          bravo: {type: 'string'},
          charlie: {
            properties: {
              foo: {type: 'string'},
              bar: {type: 'string'}
            },
            required: ['foo'],
            type: 'object'
          },
          delta: {
            properties: {
              baz: {type: 'string'},
              spam: {type: 'string'}
            },
            required: ['baz'],
            type: 'object'
          }
        },
        required: ['alpha', 'charlie'],
        type: 'object'
      }
    })

    describe('when children not present in view cell', function () {
      it('returns true when model is required root leaf property', function () {
        const cell = {model: 'alpha'}
        expect(isRequired(cell, {}, bunsenModel)).to.be.equal(true)
      })

      it('returns false when model is not required root leaf property', function () {
        const cell = {model: 'bravo'}
        expect(isRequired(cell, {}, bunsenModel)).to.be.equal(false)
      })

      it('returns true when model is required root non-leaf property', function () {
        const cell = {model: 'charlie'}
        expect(isRequired(cell, {}, bunsenModel)).to.be.equal(true)
      })

      it('returns false when model is not required root non-leaf property', function () {
        const cell = {model: 'delta'}
        expect(isRequired(cell, {}, bunsenModel)).to.be.equal(false)
      })
    })

    describe('when children present in view cell', function () {
      describe('when model is required root property', function () {
        it('and child is required leaf-property', function () {
          const cell = {
            model: 'charlie',
            children: [
              {model: 'foo'}
            ]
          }
          expect(isRequired(cell, {}, bunsenModel)).to.be.equal(true)
        })

        it('and child is not required leaf property', function () {
          const cell = {
            model: 'charlie',
            children: [
              {model: 'bar'}
            ]
          }
          expect(isRequired(cell, {}, bunsenModel)).to.be.equal(false)
        })
      })

      describe('when model is not required root property', function () {
        it('and child is required leaf-property', function () {
          const cell = {
            model: 'delta',
            children: [
              {model: 'baz'}
            ]
          }
          expect(isRequired(cell, {}, bunsenModel)).to.be.equal(true)
        })

        it('and child is not required leaf property', function () {
          const cell = {
            model: 'delta',
            children: [
              {model: 'spam'}
            ]
          }
          expect(isRequired(cell, {}, bunsenModel)).to.be.equal(false)
        })
      })
    })
  })
})
