import {expect} from 'chai'

import {
  generateFacetCell,
  generateFacetView,
  generateLabelFromModel
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
          model: 'foo.bar.baz'
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
                collapsible: true,
                label: 'Foo'
              },
              {
                children: [
                  {
                    model: 'bar'
                  }
                ],
                collapsible: true,
                label: 'Bar baz'
              },
              {
                children: [
                  {
                    model: 'foo.bar.baz'
                  }
                ],
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
})
