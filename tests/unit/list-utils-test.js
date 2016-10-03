/**
 * Unit tests for the bunsen list-utils helpers
 */

import Ember from 'ember'
const {Logger, RSVP} = Ember
import {expect} from 'chai'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import {getEnumValues, getAsyncDataValues} from 'ember-frost-bunsen/list-utils'

const heroes = Ember.A([
  Ember.Object.create({
    secret: 'Bruce Wayne',
    name: 'Batman'
  }),
  Ember.Object.create({
    secret: 'Clark Kent',
    name: 'Superman'
  }),
  Ember.Object.create({
    secret: 'Hal Jordan',
    name: 'Green Lantern'
  }),
  Ember.Object.create({
    secret: 'Barry Allen',
    name: 'Flash'
  }),
  Ember.Object.create({
    secret: 'Oliver Queen',
    name: 'Green Arrow'
  })
])

describe('Unit: list-utils', function () {
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

  describe('getAsyncDataValues()', function () {
    let sandbox, value, modelDef, bunsenId, store, filter
    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      value = {universe: 'DC'}
      modelDef = {
        modelType: 'hero',
        labelAttribute: 'name',
        valueAttribute: 'secret',
        query: {
          universe: '${../universe}'
        }
      }
      bunsenId = 'heroSecret'
      store = {
        query: sandbox.stub()
      }
      filter = 'ark'
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('with no filter', function () {
      let options, error
      beforeEach(function (done) {
        store.query.returns(RSVP.resolve(heroes))

        getAsyncDataValues(value, modelDef, bunsenId, store, filter)
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
        expect(store.query.lastCall.args).to.eql(['hero', {universe: 'DC'}])
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
        store.query.returns(RSVP.resolve(heroes))

        getAsyncDataValues(value, modelDef, bunsenId, store, filter)
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
        expect(store.query.lastCall.args).to.eql(['hero', {universe: 'DC', text: 'ark'}])
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

    describe('when query fails', function () {
      let options, error
      beforeEach(function (done) {
        modelDef.modelType = 'busted'
        store.query.withArgs('busted', {universe: 'DC'}).returns(RSVP.reject('Uh oh'))
        sandbox.stub(Logger, 'log')
        getAsyncDataValues(value, modelDef, bunsenId, store, filter)
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
  })
})
