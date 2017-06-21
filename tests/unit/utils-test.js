import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'

import {
  generateFacetCell,
  generateFacetView,
  generateLabelFromModel,
  isModelPathValid,
  isRegisteredEmberDataModel,
  isRequired,
  removeInternalValues
} from 'ember-frost-bunsen/utils'

describe('bunsen-utils', function () {
  describe('generateFacetCell()', function () {
    let facet

    beforeEach(function () {
      facet = {model: 'foo'}
    })

    afterEach(function () {
      facet = null
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
                hideLabel: true,
                renderer: {
                  name: 'multi-select'
                }
              }
            ],
            clearable: false,
            collapsible: false,
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
                hideLabel: true,
                renderer: {
                  name: 'multi-select'
                }
              }
            ],
            clearable: false,
            collapsible: false,
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
                model: 'foo',
                hideLabel: true
              }
            ],
            clearable: true,
            collapsible: false,
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
                hideLabel: true
              }
            ],
            clearable: true,
            collapsible: false,
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
        },
        {
          model: 'alpha',
          renderer: {
            name: 'checkbox-array'
          }
        },
        {
          model: 'bravo',
          renderer: {
            name: 'geolocation'
          }
        },
        {
          model: 'charlie',
          renderer: {
            name: 'json'
          }
        },
        {
          model: 'delta',
          renderer: {
            name: 'textarea'
          }
        }
      ]
    })

    afterEach(function () {
      facets = null
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
                    model: 'foo',
                    hideLabel: true
                  }
                ],
                clearable: true,
                collapsible: false,
                label: 'Foo'
              },
              {
                children: [
                  {
                    model: 'bar',
                    hideLabel: true
                  }
                ],
                clearable: true,
                collapsible: false,
                label: 'Bar baz'
              },
              {
                children: [
                  {
                    model: 'foo.bar.baz',
                    hideLabel: true,
                    renderer: {
                      name: 'multi-select'
                    }
                  }
                ],
                clearable: false,
                collapsible: false,
                label: 'Baz'
              },
              {
                children: [
                  {
                    model: 'alpha',
                    hideLabel: true,
                    renderer: {
                      name: 'checkbox-array'
                    }
                  }
                ],
                clearable: true,
                collapsible: true,
                label: 'Alpha'
              },
              {
                children: [
                  {
                    model: 'bravo',
                    hideLabel: true,
                    renderer: {
                      name: 'geolocation'
                    }
                  }
                ],
                clearable: true,
                collapsible: true,
                label: 'Bravo'
              },
              {
                children: [
                  {
                    model: 'charlie',
                    hideLabel: true,
                    renderer: {
                      name: 'json'
                    }
                  }
                ],
                clearable: true,
                collapsible: true,
                label: 'Charlie'
              },
              {
                children: [
                  {
                    model: 'delta',
                    hideLabel: true,
                    renderer: {
                      name: 'textarea'
                    }
                  }
                ],
                clearable: true,
                collapsible: true,
                label: 'Delta'
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
          expect(isRegisteredEmberDataModel(modelType)).to.equal(true)
        })
    })

    it('returns false when modelType is not registered with Ember Data', function () {
      expect(isRegisteredEmberDataModel('foo-bar')).to.equal(false)
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

    afterEach(function () {
      bunsenModel = null
    })

    describe('when children not present in view cell', function () {
      it('returns true when model is required root leaf property', function () {
        const cell = {model: 'alpha'}
        expect(isRequired(cell, {}, bunsenModel)).to.equal(true)
      })

      it('returns false when model is not required root leaf property', function () {
        const cell = {model: 'bravo'}
        expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
      })

      it('returns true when model is required root non-leaf property', function () {
        const cell = {model: 'charlie'}
        expect(isRequired(cell, {}, bunsenModel)).to.equal(true)
      })

      it('returns false when model is not required root non-leaf property', function () {
        const cell = {model: 'delta'}
        expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
      })

      it('returns false when the model is not valid', function () {
        const cell = {model: 'gamma'}
        expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
      })

      it('returns false when the model base path is not valid', function () {
        const cell = {model: 'gamma.foo'}
        expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
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
          expect(isRequired(cell, {}, bunsenModel)).to.equal(true)
        })

        it('and child is not required leaf property', function () {
          const cell = {
            model: 'charlie',
            children: [
              {model: 'bar'}
            ]
          }
          expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
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
          expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
        })

        it('and child is not required leaf property', function () {
          const cell = {
            model: 'delta',
            children: [
              {model: 'spam'}
            ]
          }
          expect(isRequired(cell, {}, bunsenModel)).to.equal(false)
        })
      })
    })
  })

  describe('isModelPathValid', function () {
    let bunsenModel

    beforeEach(function () {
      bunsenModel = {
        properties: {
          foo: {
            properties: {
              bar: {type: 'string'}
            },
            type: 'object'
          }
        },
        type: 'object'
      }
    })

    afterEach(function () {
      bunsenModel = null
    })

    it('returns false when the path is invalid', function () {
      expect(isModelPathValid('baz', bunsenModel)).to.equal(false)
      expect(isModelPathValid('foo.baz', bunsenModel)).to.equal(false)
    })

    it('returns true when the path is valid', function () {
      expect(isModelPathValid('foo', bunsenModel)).to.equal(true)
      expect(isModelPathValid('foo.bar', bunsenModel)).to.equal(true)
    })
  })

  describe('removeInternalValues', function () {
    it('returns an equal object when there are no internal values', function () {
      const value = {
        foo: {
          bar: {
            baz: {},
            quux: {}
          }
        }
      }
      const withoutInternals = removeInternalValues(value)
      expect(withoutInternals).to.eql({
        foo: {
          bar: {
            baz: {},
            quux: {}
          }
        }
      })
    })
    it('finds and removes internal values at the top level', function () {
      const value = {
        foo: {
          bar: {
            baz: {},
            quux: {}
          }
        },
        _internal: {
          bar: {
            baz: {},
            quux: {}
          }
        }
      }
      const internals = removeInternalValues(value)
      expect(internals).to.eql({
        foo: {
          bar: {
            baz: {},
            quux: {}
          }
        }
      })
    })
    it('finds and removes internal values at the deeper levels', function () {
      const value = {
        foo: {
          bar: {
            baz: {
              _internal: {
                bar: {
                  baz: {},
                  quux: {}
                }
              }
            },
            quux: {
              _internal: {
                bar: {
                  baz: {},
                  quux: {}
                }
              }
            },
            _internal: {
              bar: {
                baz: {},
                quux: {}
              }
            }
          },
          _internal: {
            bar: {
              baz: {},
              quux: {}
            }
          }
        }
      }
      const internals = removeInternalValues(value)
      expect(internals).to.eql({
        foo: {
          bar: {
            baz: {},
            quux: {}
          }
        }
      })
    })
  })
})
