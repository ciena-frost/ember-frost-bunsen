const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'
import _ from 'lodash'
import $ from 'jquery'

const records = [
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
    resourceTypeId: 'helloThere',
    domainId: '12345',
    get: function (attribute) {
      return this[attribute]
    }
  },
  {
    id: 2,
    type: 'resource',
    label: 'Resource 3',
    domainId: '12345',
    get: function (attribute) {
      return this[attribute]
    }
  },
  {
    id: 3,
    type: 'resource',
    label: 'Resource 4',
    get: function (attribute) {
      return this[attribute]
    }
  }
]

const formValue = {
  value: {
    domainId: 12345,
    foo: {
      bar: {
        someOtherProp: 'helloThere'
      }
    }
  }
}

/**
 * Stub out the DB service with the given product ID for the given resourceType
 * @param {Object} ctx - the testing context
 * @param {String} resourceType - the type of resource to stub out product lookup for
 * @param {String} productId - the productId to return in the stubbed lookup
 */
function stubDbService (ctx) {
  const promiseMe = (data) => (new Ember.RSVP.Promise(function (resolve) {
    resolve(Ember.A(data))
  }))

  const query = (type, query) => {
    let [qProp, qValue] = query.q.split(':')
    let rtValue = query.resourceTypeId
    return promiseMe(_.filter(records, (record) => {
      return record[qProp] === qValue && record.resourceTypeId === rtValue
    }))
  }

  const findAll = sinon.stub()
    .withArgs('resource-provider')
    .returns(promiseMe(records))

  const dbStub = Ember.Service.extend({
    findAll,
    query
  })

  ctx.register('service:store', dbStub)
  ctx.inject.service('store', { as: 'dbStore' })
}

describeComponent(...integrationTestContext('frost-bunsen-input-select'), function () {
  let rootNode
  let props

  describe('the select input renderer', function () {
    beforeEach(function () {
      stubDbService(this)
      props = {
        bunsenId: 'enabled',
        cellConfig: Ember.Object.create({}),
        model: {},
        onChange: () => {},
        store: Ember.Object.create({}),
        state: Ember.Object.create(),
        formValue,
        dbStore: this.get('dbStore')
      }
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
    })

    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-input-select')
    })

    it('has correct enum of values', function () {
      props.model.enum = ['foo', 'bar', 'fitz', 'batz']
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      _.forEach(props.model.enum, (value) => {
        const isPresent = $(rootNode).text().indexOf(Ember.String.capitalize(value)) !== -1
        expect(isPresent).to.eql(true)
      })
    })

    it('gets async values', function (done) {
      props.model = {
        modelType: 'resource',
        labelAttribute: 'label',
        valueAttribute: 'id',
        query: {
          resourceTypeId: '${foo.bar.someOtherProp}',
          q: 'domainId:${domainId}',
          p: 'label:fo'
        }
      }
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      const expected = ['Resource 2']
      expect($(rootNode).text().indexOf(expected) !== -1).to.eql(true)
      expect($(rootNode).find('li').length).to.equal(expected.length)
      done()
    })
  })
})
