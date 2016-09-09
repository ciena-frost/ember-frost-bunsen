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
    let sandbox, value, modelDef, bunsenId, dbStore, filter
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
      dbStore = {
        query: sandbox.stub()
      }
      filter = 'ark'
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('with no filter', function () {
      let options
      beforeEach(function () {
        dbStore.query.returns(RSVP.resolve(heroes))

        return getAsyncDataValues(value, modelDef, bunsenId, dbStore, filter).then((items) => {
          options = items
        })
      })

      it('should make the appropriate query', function () {
        expect(dbStore.query.lastCall.args).to.be.eql(['hero', {universe: 'DC'}])
      })

      it('should return the proper options', function () {
        expect(options).to.be.eql([
          {value: 'Bruce Wayne', label: 'Batman'},
          {value: 'Clark Kent', label: 'Superman'},
          {value: 'Hal Jordan', label: 'Green Lantern'},
          {value: 'Barry Allen', label: 'Flash'},
          {value: 'Oliver Queen', label: 'Green Arrow'}
        ])
      })
    })

    describe('with filter', function () {
      let options
      beforeEach(function () {
        modelDef.query.text = '$filter'
        dbStore.query.returns(RSVP.resolve(heroes))

        return getAsyncDataValues(value, modelDef, bunsenId, dbStore, filter).then((items) => {
          options = items
        })
      })

      it('should make the appropriate query', function () {
        expect(dbStore.query.lastCall.args).to.be.eql(['hero', {universe: 'DC', text: 'ark'}])
      })

      it('should return the proper options', function () {
        expect(options).to.be.eql([
          {value: 'Bruce Wayne', label: 'Batman'},
          {value: 'Clark Kent', label: 'Superman'},
          {value: 'Hal Jordan', label: 'Green Lantern'},
          {value: 'Barry Allen', label: 'Flash'},
          {value: 'Oliver Queen', label: 'Green Arrow'}
        ])
      })
    })

    // FIXME: somehow this is throwing an error instead of being caught in the `catch()` under test (ARM 2016-09-09)
    describe.skip('when query is fails', function () {
      beforeEach(function () {
        modelDef.modelType = 'busted'
        dbStore.query.withArgs('busted', {}).returns(RSVP.reject('Uh oh'))
        sandbox.stub(Logger, 'log')
        return getAsyncDataValues(value, modelDef, bunsenId, dbStore, filter)
      })

      it('should log the error', function () {
        expect(Logger.log.lastCall.args).to.be.eql(['Error fetching busted', 'Uh oh'])
      })
    })
  })
})
