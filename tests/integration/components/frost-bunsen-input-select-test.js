const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'
import _ from 'lodash'
import $ from 'jquery'

/**
 * Stub out the DB service with the given product ID for the given resourceType
 * @param {Object} ctx - the testing context
 * @param {String} resourceType - the type of resource to stub out product lookup for
 * @param {String} productId - the productId to return in the stubbed lookup
 */
function stubDbService (ctx) {
  const promise = new Ember.RSVP.Promise(function (resolve) {
    resolve(Ember.A([
      {
        id: 1,
        type: 'resource',
        label: 'Resource 1',
        get: function (attribute) {
          return this[attribute]
        }
      },
      {
        id: 2,
        type: 'resource',
        label: 'Resource 2',
        get: function (attribute) {
          return this[attribute]
        }
      },
      {
        id: 3,
        type: 'resource',
        label: 'Resource 3',
        get: function (attribute) {
          return this[attribute]
        }
      }
    ]))
  })

  const findAllStub = sinon.stub()
    .withArgs('resource-provider')
    .returns(promise)

  const queryStub = sinon.stub()
    .withArgs('resource')
    .returns(promise)

  const dbStub = Ember.Service.extend({
    findAll: findAllStub,
    query: queryStub
  })

  ctx.register('service:store', dbStub)
  ctx.inject.service('store', { as: 'dbStore' })
}

describeComponent(...integrationTestContext('frost-bunsen-input-select'), function () {
  let rootNode
  let props

  describe.only('the select input renderer', function () {
    beforeEach(function () {
      stubDbService(this)
      props = {
        bunsenId: 'enabled',
        cellConfig: Ember.Object.create({}),
        model: {},
        onChange: () => {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({value: true}),
        dbStore: this.get('dbStore')
      }
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
    })

    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-input-select')
    })

    it('has correct enum of values', function () {
      props.model.enum = [
        'foo',
        'bar',
        'fitz',
        'batz'
      ]
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      _.forEach(props.model.enum, (value) => {
        const isPresent = $(rootNode).text().indexOf(Ember.String.capitalize(value)) !== -1
        expect(isPresent).to.eql(true)
      })
    })

    it('gets async values', function (done) {
      const expected = [
        'Resource 1',
        'Resource 2',
        'Resource 3'
      ]
      _.extend(props.model, {
        'modelType': 'resource',
        'labelAttribute': 'label',
        'valueAttribute': 'id',
        'query': {
          resourceTypeId: 'foo.bat.bitz',
          q: 'domainId:${../domainId}',
          p: 'label:fo'
        }
      })
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      Ember.run.later(() => {
        _.forEach(expected, (value) => {
          const isPresent = $(rootNode).text().indexOf(value) !== -1
          expect(isPresent).to.eql(true)
        })
        done()
      })
    })
  })
})
