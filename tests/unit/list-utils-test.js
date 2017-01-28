/**
 * Unit tests for the bunsen list-utils helpers
 */

import {expect} from 'chai'
import Ember from 'ember'
const {A, Logger, RSVP} = Ember
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {getEnumValues, getItemsFromEmberData, getOptions} from 'ember-frost-bunsen/list-utils'

const heroes = A([
  Ember.Object.create({
    secret: 'Bruce Wayne',
    name: 'Batman',
    id: 1
  }),
  Ember.Object.create({
    secret: 'Clark Kent',
    name: 'Superman',
    id: 2
  }),
  Ember.Object.create({
    secret: 'Hal Jordan',
    name: 'Green Lantern',
    id: 3
  }),
  Ember.Object.create({
    secret: 'Barry Allen',
    name: 'Flash',
    id: 4
  }),
  Ember.Object.create({
    secret: 'Oliver Queen',
    name: 'Green Arrow',
    id: 5
  })
])

const extraHero = Ember.Object.create({
  secret: 'Al Rothstein',
  name: 'Atom Smasher',
  id: 42
})

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
  })

  describe('getItemsFromEmberData()', function () {
    let value, modelDef, bunsenId, store, filter, data

    beforeEach(function () {
      value = {universe: 'DC', heroSecret: 42}
      data = []
      bunsenId = 'heroSecret'
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
            universe: '${../universe}'
          }
        }
      })

      it('should include a boolean query param to ensure that we do not assume a string', function () {
        expect(modelDef.query.booleanFlag).to.equal(true)
      })

      describe('with no filter', function () {
        let options, error

        beforeEach(function (done) {
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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

          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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

          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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

          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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
            universe: '${../universe}'
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
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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

          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
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

      describe('when value is not a number', function () {
        beforeEach(function (done) {
          value = {universe: 'DC', heroSecret: 'Smashed!'}
          getItemsFromEmberData(value, modelDef, data, bunsenId, store, filter)
            .finally(() => {
              done()
            })
        })

        it('should not call store.findRecord', function () {
          expect(store.findRecord).to.have.callCount(0)
        })

        it('should call store.query', function () {
          expect(store.query).to.have.been.calledWith('hero', {booleanFlag: true, universe: 'DC'})
        })
      })
    })
  })

  describe('getOptions', function () {
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
          bunsenId: '',
          data,
          options: modelDef,
          store,
          value: {}
        }).then((data) => {
          options = data
          done()
        })
        expect(store.query.calledWith('resource', {}))
      })

      it('calls story.query with supplied query when query is provided', function (done) {
        modelDef.query = {
          label: 'labelName'
        }
        getOptions({
          bunsenId: '',
          data,
          options: modelDef,
          store,
          value: {}
        }).then((data) => {
          options = data
          done()
        })
        expect(store.query.calledWith('resource', {label: 'labelName'}))
      })
    })
  })
})
