/**
 * Unit tests for the bunsen list-utils helpers
 */

import {expect} from 'chai'
import Ember from 'ember'
const {A, Logger, RSVP} = Ember
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {getEnumValues, getItemsFromAjaxCall, getItemsFromEmberData, getOptions} from 'ember-frost-bunsen/list-utils'

const heroPojos = [
  {id: 1, name: 'Batman', secret: 'Bruce Wayne', title: 'The Dark Knight'},
  {id: 2, name: 'Superman', secret: 'Clark Kent', title: 'The Man of Steel'},
  {id: 3, name: 'Green Lantern', secret: 'Hal Jordan', title: 'Green Lantern 2814.1'},
  {id: 4, name: 'Flash', secret: 'Barry Allen', title: 'The Fastest Man Alive'},
  {id: 5, name: 'Green Arrow', secret: 'Oliver Queen', title: 'The Hood'}
]

const extraHeroPojo = {id: 42, name: 'Atom Smasher', secret: 'Al Rothstein', title: 'Nuklon'}
const extraHeroPojoIdAsString = {
  id: '16977f3d-120f-3d4d-b573-e8bf77a330ac',
  name: 'Wonder Woman',
  secret: 'Diana',
  title: 'Wonder Woman'
}

describe('Unit: list-utils', function () {
  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('getEnumValues()', function () {
    it('returns literal values', function () {
      const values = ['Foo', 'BAR', 'baz']
      expect(getEnumValues(values)).to.eql([
        {
          label: 'Foo',
          value: 'Foo'
        },
        {
          label: 'BAR',
          value: 'BAR'
        },
        {
          label: 'baz',
          value: 'baz'
        }
      ])
    })

    it('returns only string values for label', function () {
      const values = [0, 1, 2, 3]
      expect(getEnumValues(values)).to.eql([
        {
          label: '0',
          value: 0
        },
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        }
      ])
    })
  })

  describe('getItemsFromAjaxCall()', function () {
    let value, options, bunsenId, ajax, filter, data

    beforeEach(function () {
      value = {universe: 'DC', heroId: 42}
      data = []
      bunsenId = 'heroId'
      ajax = {
        request: sandbox.stub().returns(RSVP.resolve({data: heroPojos}))
      }
      options = {
        endpoint: '/api/v1/heroes',
        recordsPath: 'data',
        query: {
          booleanFlag: true,
          universe: '${../universe}'
        }
      }
      filter = 'ark'
    })

    describe('when "labelAttribute" and "valueAttribute" are unset', function () {
      beforeEach(function () {
      })

      it('should include a boolean query param to ensure that we do not assume a string', function () {
        expect(options.query.booleanFlag).to.equal(true)
      })

      describe('with no filter', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes?booleanFlag=true&universe=DC')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'The Dark Knight', value: 1},
            {label: 'The Man of Steel', value: 2},
            {label: 'Green Lantern 2814.1', value: 3},
            {label: 'The Fastest Man Alive', value: 4},
            {label: 'The Hood', value: 5}
          ])
        })
      })

      describe('with filter', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          options.query.text = '$filter'

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes?booleanFlag=true&universe=DC&text=ark')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'The Dark Knight', value: 1},
            {label: 'The Man of Steel', value: 2},
            {label: 'Green Lantern 2814.1', value: 3},
            {label: 'The Fastest Man Alive', value: 4},
            {label: 'The Hood', value: 5}
          ])
        })
      })

      describe('when data is populated', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          data = [{label: 'None', value: -1}]

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'None', value: -1},
            {label: 'The Dark Knight', value: 1},
            {label: 'The Man of Steel', value: 2},
            {label: 'Green Lantern 2814.1', value: 3},
            {label: 'The Fastest Man Alive', value: 4},
            {label: 'The Hood', value: 5}
          ])
        })

        it('should not error', function () {
          expect(error).to.equal(undefined)
        })
      })

      describe('when query fails', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          options.endpoint = '/busted'
          ajax.request.withArgs('/busted?booleanFlag=true&universe=DC').returns(RSVP.reject('Uh oh'))
          sandbox.stub(Logger, 'error')

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should not resolve', function () {
          expect(normalizedItems).to.equal(undefined)
        })

        it('should reject', function () {
          expect(error).to.equal('Uh oh')
        })

        it('should log the error', function () {
          expect(Logger.error).to.have.been.calledWith('Error fetching endpoint "/busted"', 'Uh oh')
        })
      })

      describe('when query not present', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          delete options.query

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'The Dark Knight', value: 1},
            {label: 'The Man of Steel', value: 2},
            {label: 'Green Lantern 2814.1', value: 3},
            {label: 'The Fastest Man Alive', value: 4},
            {label: 'The Hood', value: 5}
          ])
        })
      })
    })

    describe('when "labelAttribute" and "valueAttribute" are plain strings', function () {
      beforeEach(function () {
        options.labelAttribute = 'name'
        options.valueAttribute = 'secret'
      })

      it('should include a boolean query param to ensure that we do not assume a string', function () {
        expect(options.query.booleanFlag).to.equal(true)
      })

      describe('with no filter', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes?booleanFlag=true&universe=DC')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'Batman', value: 'Bruce Wayne'},
            {label: 'Superman', value: 'Clark Kent'},
            {label: 'Green Lantern', value: 'Hal Jordan'},
            {label: 'Flash', value: 'Barry Allen'},
            {label: 'Green Arrow', value: 'Oliver Queen'}
          ])
        })
      })

      describe('with filter', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          options.query.text = '$filter'

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes?booleanFlag=true&universe=DC&text=ark')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'Batman', value: 'Bruce Wayne'},
            {label: 'Superman', value: 'Clark Kent'},
            {label: 'Green Lantern', value: 'Hal Jordan'},
            {label: 'Flash', value: 'Barry Allen'},
            {label: 'Green Arrow', value: 'Oliver Queen'}
          ])
        })
      })

      describe('when data is populated', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          data = [{label: 'None', value: ''}]

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'None', value: ''},
            {label: 'Batman', value: 'Bruce Wayne'},
            {label: 'Superman', value: 'Clark Kent'},
            {label: 'Green Lantern', value: 'Hal Jordan'},
            {label: 'Flash', value: 'Barry Allen'},
            {label: 'Green Arrow', value: 'Oliver Queen'}
          ])
        })

        it('should not error', function () {
          expect(error).to.equal(undefined)
        })
      })

      describe('when query fails', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          options.endpoint = '/busted'
          ajax.request.withArgs('/busted?booleanFlag=true&universe=DC').returns(RSVP.reject('Uh oh'))
          sandbox.stub(Logger, 'error')

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should not resolve', function () {
          expect(normalizedItems).to.equal(undefined)
        })

        it('should reject', function () {
          expect(error).to.equal('Uh oh')
        })

        it('should log the error', function () {
          expect(Logger.error).to.have.been.calledWith('Error fetching endpoint "/busted"', 'Uh oh')
        })
      })

      describe('when query not present', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          delete options.query

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'Batman', value: 'Bruce Wayne'},
            {label: 'Superman', value: 'Clark Kent'},
            {label: 'Green Lantern', value: 'Hal Jordan'},
            {label: 'Flash', value: 'Barry Allen'},
            {label: 'Green Arrow', value: 'Oliver Queen'}
          ])
        })
      })
    })

    describe('when "labelAttribute" and "valueAttribute" are template strings', function () {
      beforeEach(function () {
        options.labelAttribute = '${name} (${secret})'
        options.valueAttribute = '${secret} (${id})'
      })

      it('should include a boolean query param to ensure that we do not assume a string', function () {
        expect(options.query.booleanFlag).to.equal(true)
      })

      describe('with no filter', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes?booleanFlag=true&universe=DC')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'Batman (Bruce Wayne)', value: 'Bruce Wayne (1)'},
            {label: 'Superman (Clark Kent)', value: 'Clark Kent (2)'},
            {label: 'Green Lantern (Hal Jordan)', value: 'Hal Jordan (3)'},
            {label: 'Flash (Barry Allen)', value: 'Barry Allen (4)'},
            {label: 'Green Arrow (Oliver Queen)', value: 'Oliver Queen (5)'}
          ])
        })
      })

      describe('with filter', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          options.query.text = '$filter'

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes?booleanFlag=true&universe=DC&text=ark')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'Batman (Bruce Wayne)', value: 'Bruce Wayne (1)'},
            {label: 'Superman (Clark Kent)', value: 'Clark Kent (2)'},
            {label: 'Green Lantern (Hal Jordan)', value: 'Hal Jordan (3)'},
            {label: 'Flash (Barry Allen)', value: 'Barry Allen (4)'},
            {label: 'Green Arrow (Oliver Queen)', value: 'Oliver Queen (5)'}
          ])
        })
      })

      describe('when data is populated', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          data = [{label: 'None', value: ''}]

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'None', value: ''},
            {label: 'Batman (Bruce Wayne)', value: 'Bruce Wayne (1)'},
            {label: 'Superman (Clark Kent)', value: 'Clark Kent (2)'},
            {label: 'Green Lantern (Hal Jordan)', value: 'Hal Jordan (3)'},
            {label: 'Flash (Barry Allen)', value: 'Barry Allen (4)'},
            {label: 'Green Arrow (Oliver Queen)', value: 'Oliver Queen (5)'}
          ])
        })

        it('should not error', function () {
          expect(error).to.equal(undefined)
        })
      })

      describe('when query fails', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          options.endpoint = '/busted'
          ajax.request.withArgs('/busted?booleanFlag=true&universe=DC').returns(RSVP.reject('Uh oh'))
          sandbox.stub(Logger, 'error')

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should not resolve', function () {
          expect(normalizedItems).to.equal(undefined)
        })

        it('should reject', function () {
          expect(error).to.equal('Uh oh')
        })

        it('should log the error', function () {
          expect(Logger.error).to.have.been.calledWith('Error fetching endpoint "/busted"', 'Uh oh')
        })
      })

      describe('when query not present', function () {
        let normalizedItems, error

        beforeEach(function (done) {
          delete options.query

          getItemsFromAjaxCall({ajax, bunsenId, data, filter, options, value})
            .then((items) => {
              normalizedItems = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(ajax.request).to.have.been.calledWith('/api/v1/heroes')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(normalizedItems).to.eql([
            {label: 'Batman (Bruce Wayne)', value: 'Bruce Wayne (1)'},
            {label: 'Superman (Clark Kent)', value: 'Clark Kent (2)'},
            {label: 'Green Lantern (Hal Jordan)', value: 'Hal Jordan (3)'},
            {label: 'Flash (Barry Allen)', value: 'Barry Allen (4)'},
            {label: 'Green Arrow (Oliver Queen)', value: 'Oliver Queen (5)'}
          ])
        })
      })
    })
  })

  describe('getItemsFromEmberData()', function () {
    let heroes, extraHero, value, modelDef, bunsenId, store, filter, data

    beforeEach(function () {
      heroes = A(heroPojos.map((hero) => Ember.Object.create(hero)))
      extraHero = Ember.Object.create(extraHeroPojo)
      value = {
        heroes: [{
          universe: 'DC', heroSecret: 42
        }]
      }
      data = []
      bunsenId = 'heroes.0.heroSecret'
      store = {
        findRecord: sandbox.stub(),
        query: sandbox.stub()
      }
      filter = 'ark'
    })

    describe('when queryForCurrentValue is falsey', function () {
      beforeEach(function () {
        store.query.returns(RSVP.resolve(heroes))
        modelDef = {
          modelType: 'hero',
          labelAttribute: 'name',
          valueAttribute: 'secret',
          query: {
            booleanFlag: true,
            universe: '${./universe}'
          }
        }
      })

      it('should include a boolean query param to ensure that we do not assume a string', function () {
        expect(modelDef.query.booleanFlag).to.equal(true)
      })

      describe('with no filter', function () {
        let options, error

        beforeEach(function (done) {
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query).to.have.been.calledWithExactly('hero', {booleanFlag: true, universe: 'DC'})
        })

        it('should not call store.findRecord', function () {
          expect(store.findRecord).to.have.callCount(0)
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 'Bruce Wayne', label: 'Batman'},
            {value: 'Clark Kent', label: 'Superman'},
            {value: 'Hal Jordan', label: 'Green Lantern'},
            {value: 'Barry Allen', label: 'Flash'},
            {value: 'Oliver Queen', label: 'Green Arrow'}
          ])
        })
      })

      describe('with filter', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.query.text = '$filter'

          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {booleanFlag: true, universe: 'DC', text: 'ark'}])
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 'Bruce Wayne', label: 'Batman'},
            {value: 'Clark Kent', label: 'Superman'},
            {value: 'Hal Jordan', label: 'Green Lantern'},
            {value: 'Barry Allen', label: 'Flash'},
            {value: 'Oliver Queen', label: 'Green Arrow'}
          ])
        })
      })

      describe('when data is populated', function () {
        let options

        beforeEach(function (done) {
          data = [
            {
              label: 'Custom',
              value: 'Custom'
            }
          ]
          store.query.returns(RSVP.resolve(heroes))

          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .finally(() => {
              done()
            })
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 'Custom', label: 'Custom'},
            {value: 'Bruce Wayne', label: 'Batman'},
            {value: 'Clark Kent', label: 'Superman'},
            {value: 'Hal Jordan', label: 'Green Lantern'},
            {value: 'Barry Allen', label: 'Flash'},
            {value: 'Oliver Queen', label: 'Green Arrow'}
          ])
        })
      })

      describe('when query fails', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.modelType = 'busted'
          store.query.withArgs('busted', {booleanFlag: true, universe: 'DC'}).returns(RSVP.reject('Uh oh'))
          sandbox.stub(Logger, 'log')
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should not resolve', function () {
          expect(options).to.equal(undefined)
        })

        it('should reject', function () {
          expect(error).to.equal('Uh oh')
        })

        it('should log the error', function () {
          expect(Logger.log.lastCall.args).to.eql(['Error fetching busted', 'Uh oh'])
        })
      })

      describe('when query not present', function () {
        let options, error

        beforeEach(function (done) {
          delete modelDef.query
          store.query.returns(RSVP.resolve(heroes))

          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {}])
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 'Bruce Wayne', label: 'Batman'},
            {value: 'Clark Kent', label: 'Superman'},
            {value: 'Hal Jordan', label: 'Green Lantern'},
            {value: 'Barry Allen', label: 'Flash'},
            {value: 'Oliver Queen', label: 'Green Arrow'}
          ])
        })
      })
    })

    describe('when queryForCurrentValue is true', function () {
      beforeEach(function () {
        store.query.returns(RSVP.resolve(heroes))
        store.findRecord.returns(RSVP.resolve(extraHero))
        filter = ''
        modelDef = {
          modelType: 'hero',
          labelAttribute: 'name',
          valueAttribute: 'id',
          query: {
            booleanFlag: true,
            universe: '${./universe}'
          },
          queryForCurrentValue: true
        }
      })

      it('should include a boolean query param to ensure that we do not assume a string', function () {
        expect(modelDef.query.booleanFlag).to.equal(true)
      })

      describe('with no filter', function () {
        let options, error

        beforeEach(function (done) {
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query).to.have.been.calledWithExactly('hero', {booleanFlag: true, universe: 'DC'})
        })

        it('should make the appropriate find record call', function () {
          expect(store.findRecord).to.have.been.calledWithExactly('hero', 42)
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'},
            {value: 42, label: 'Atom Smasher'}
          ])
        })
      })

      describe('with filter that excludes current value', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.query.text = '$filter'
          filter = 'ark'
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {booleanFlag: true, universe: 'DC', text: 'ark'}])
        })

        it('should make the appropriate find record call', function () {
          expect(store.findRecord).to.have.been.calledWithExactly('hero', 42)
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'}
          ])
        })
      })

      describe('with filter that includes current value', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.query.text = '$filter'
          filter = 'ato'
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {booleanFlag: true, universe: 'DC', text: 'ato'}])
        })

        it('should make the appropriate find record call', function () {
          expect(store.findRecord).to.have.been.calledWithExactly('hero', 42)
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'},
            {value: 42, label: 'Atom Smasher'}
          ])
        })
      })

      describe('when data is populated', function () {
        let options

        beforeEach(function (done) {
          data = [
            {
              label: 'Custom',
              value: 'Custom'
            }
          ]
          store.query.returns(RSVP.resolve(heroes))

          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .finally(() => {
              done()
            })
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 'Custom', label: 'Custom'},
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'},
            {value: 42, label: 'Atom Smasher'}
          ])
        })
      })

      describe('when query fails', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.modelType = 'busted'
          store.query.withArgs('busted', {booleanFlag: true, universe: 'DC'}).returns(RSVP.reject('Uh oh'))
          sandbox.stub(Logger, 'log')
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should not resolve', function () {
          expect(options).to.equal(undefined)
        })

        it('should reject', function () {
          expect(error).to.equal('Uh oh')
        })

        it('should log the error', function () {
          expect(Logger.log.lastCall.args).to.eql(['Error fetching busted', 'Uh oh'])
        })
      })

      describe('when query not present', function () {
        let options, error

        beforeEach(function (done) {
          delete modelDef.query
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {}])
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'},
            {value: 42, label: 'Atom Smasher'}
          ])
        })
      })
    })

    describe('when queryForCurrentValue is true and keepCurrentValue is false', function () {
      beforeEach(function () {
        value = {
          heroes: [{
            universe: 'DC', heroSecret: '16977f3d-120f-3d4d-b573-e8bf77a330ac'
          }]
        }
        store.query.returns(RSVP.resolve(heroes))
        filter = ''
        modelDef = {
          modelType: 'hero',
          labelAttribute: 'name',
          valueAttribute: 'id',
          query: {
            booleanFlag: true,
            universe: '${./universe}'
          },
          queryForCurrentValue: true
        }

        return getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter, keepCurrentValue: false})
      })

      it('should not make a find record call', function () {
        expect(store.findRecord).to.have.callCount(0)
      })
    })

    describe('when queryForCurrentValue is true is a string', function () {
      beforeEach(function () {
        let newHero = Ember.Object.create(extraHeroPojoIdAsString)
        value = {
          heroes: [{
            universe: 'DC', heroSecret: '16977f3d-120f-3d4d-b573-e8bf77a330ac'
          }]
        }
        store.query.returns(RSVP.resolve(heroes))
        store.findRecord.returns(RSVP.resolve(newHero))
        filter = ''
        modelDef = {
          modelType: 'hero',
          labelAttribute: 'name',
          valueAttribute: 'id',
          query: {
            booleanFlag: true,
            universe: '${./universe}'
          },
          queryForCurrentValue: true
        }
      })

      describe('with no filter', function () {
        let options, error

        beforeEach(function (done) {
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query).to.have.been.calledWithExactly('hero', {booleanFlag: true, universe: 'DC'})
        })

        it('should make the appropriate find record call', function () {
          expect(store.findRecord).to.have.been.calledWithExactly('hero', '16977f3d-120f-3d4d-b573-e8bf77a330ac')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'},
            {value: '16977f3d-120f-3d4d-b573-e8bf77a330ac', label: 'Wonder Woman'}
          ])
        })
      })

      describe('with filter that excludes current value', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.query.text = '$filter'
          filter = 'ark'
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {booleanFlag: true, universe: 'DC', text: 'ark'}])
        })

        it('should make the appropriate find record call', function () {
          expect(store.findRecord).to.have.been.calledWithExactly('hero', '16977f3d-120f-3d4d-b573-e8bf77a330ac')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'}
          ])
        })
      })

      describe('with filter that includes current value', function () {
        let options, error

        beforeEach(function (done) {
          modelDef.query.text = '$filter'
          filter = 'won'
          getItemsFromEmberData({value, modelDef, data, bunsenId, store, filter})
            .then((items) => {
              options = items
            })
            .catch((err) => {
              error = err
            })
            .finally(() => {
              done()
            })
        })

        it('should make the appropriate query', function () {
          expect(store.query.lastCall.args).to.eql(['hero', {booleanFlag: true, universe: 'DC', text: 'won'}])
        })

        it('should make the appropriate find record call', function () {
          expect(store.findRecord).to.have.been.calledWithExactly('hero', '16977f3d-120f-3d4d-b573-e8bf77a330ac')
        })

        it('should not trigger the catch', function () {
          expect(error).to.equal(undefined)
        })

        it('should return the proper options', function () {
          expect(options).to.eql([
            {value: 1, label: 'Batman'},
            {value: 2, label: 'Superman'},
            {value: 3, label: 'Green Lantern'},
            {value: 4, label: 'Flash'},
            {value: 5, label: 'Green Arrow'},
            {value: '16977f3d-120f-3d4d-b573-e8bf77a330ac', label: 'Wonder Woman'}
          ])
        })
      })
    })
  })

  describe('getOptions()', function () {
    let data, modelDef, options
    beforeEach(function () {
      data = [
        {
          label: 'Custom1',
          value: 'Custom1'
        },
        {
          label: 'Custom2',
          value: 'Custom2'
        }
      ]
      modelDef = {
        query: null
      }
    })

    describe('when filter is not provided', function () {
      beforeEach(function (done) {
        getOptions({
          bunsenId: '',
          data,
          options: modelDef,
          store: {},
          value: {}
        }).then((data) => {
          options = data
          done()
        })
      })

      it('resolves with the data', function () {
        expect(options).to.eql(data)
      })
    })

    describe('when filter is provided', function () {
      beforeEach(function (done) {
        getOptions({
          bunsenId: '',
          data,
          filter: 'Custom2',
          options: modelDef,
          store: {},
          value: {}
        }).then((data) => {
          options = data
          done()
        })
      })

      it('resolves with the filtered data', function () {
        expect(options).to.eql([
          {
            label: 'Custom2',
            value: 'Custom2'
          }
        ])
      })
    })

    describe('when model contains modelType', function () {
      let store
      beforeEach(function () {
        store = {
          query: sinon.stub().returns(RSVP.resolve([]))
        }
        modelDef.modelType = 'resource'
      })

      it('calls store.query with empty query when no query is provided', function (done) {
        getOptions({
          bunsenId: 'foo',
          data,
          options: modelDef,
          store,
          value: {}
        }).then((data) => {
          options = data
          done()
        })
        expect(store.query).to.be.calledWith('resource', {})
      })

      it('calls story.query with supplied query when query is provided', function (done) {
        modelDef.query = {
          label: 'labelName'
        }
        getOptions({
          bunsenId: 'foo',
          data,
          options: modelDef,
          store,
          value: {}
        }).then((data) => {
          options = data
          done()
        })
        expect(store.query).to.be.calledWith('resource', {label: 'labelName'})
      })
    })
  })
})
