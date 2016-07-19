import {expect} from 'chai'
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'
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
    id: 3,
    type: 'resource',
    label: 'Resource 3',
    domainId: '12345',
    get: function (attribute) {
      return this[attribute]
    }
  },
  {
    id: 4,
    type: 'resource',
    label: 'Resource 4',
    get: function (attribute) {
      return this[attribute]
    }
  }
]

const formValue = {
  domainId: 12345,
  foo: {
    bar: {
      someOtherProp: 'helloThere'
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
  const promiseMe = (data) => Ember.RSVP.resolve(Ember.A(data))

  const query = sinon.spy((type, query) => {
    if (query.q) {
      let [qProp, qValue] = query.q.split(':')
      let rtValue = query.resourceTypeId
      return promiseMe(_.filter(records, (record) => {
        return record[qProp] === qValue && record.resourceTypeId === rtValue
      }))
    }
    if (query.p) {
      let [pProp, pValue] = query.p.split(':')
      return promiseMe(_.filter(records, (record) => {
        return record[pProp].toLowerCase().indexOf(pValue.toLowerCase()) !== -1
      }))
    }
    return promiseMe(records)
  })

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
        bunsenModel: {},
        bunsenStore: Ember.Object.create({
          formValue
        }),
        cellConfig: Ember.Object.create({}),
        onChange () {},
        state: Ember.Object.create(),
        dbStore: this.get('dbStore')
      }
    })

    describe('when write transform is specified', function () {
      beforeEach(function () {
        const cellConfig = {
          model: 'name',
          renderer: {
            name: 'select'
          },
          transforms: {
            write: [
              {
                object: {
                  id: '${id}',
                  index: '${index}',
                  label: '${label}',
                  literal: 'foo',
                  value: '${value}'
                }
              }
            ]
          }
        }

        const view = {
          cellDefinitions: [
            {
              id: 'main',
              children: [
                [cellConfig]
              ]
            }
          ],
          cells: [{
            extends: 'main',
            label: 'Main'
          }],
          type: 'form',
          version: '2.0'
        }

        props = {
          bunsenId: 'name',
          bunsenModel: {
            enum: ['Adam', 'Chris', 'Matt', 'Niko', 'Sophy'],
            type: 'string'
          },
          bunsenStore: Ember.Object.create({
            view
          }),
          cellConfig: Ember.Object.create(cellConfig),
          onChange () {},
          state: Ember.Object.create({}),
          value: undefined // Must be present so we can set it via this.set('value', value)
        }

        rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      })

      it('applies the object transform', function (done) {
        Ember.run.next(() => {
          this.set('onChange', (id, value) => {
            // sadly, we get two onChange calls here, one when the value is empty and another once the value is
            // actually set, so instead of doing an expect() on the value, we won't call don() unless it matches
            // what we expect it to be
            const expected = {
              id: 'name',
              index: '1',
              label: 'Chris',
              literal: 'foo',
              value: 'Chris'
            }
            if (_.isEqual(value, expected) && (id === 'name')) {
              done()
            }
          })

          rootNode.find('.down-arrow').click()
          rootNode.find('li[data-value="Chris"]').click()
        })
      })
    })

    describe('when bunsenStore.disabled is true', function () {
      beforeEach(function () {
        rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
        this.set('bunsenStore.disabled', true)
      })

      it('disables input', function () {
        const $input = rootNode.find('.frost-select input')
        expect($input.is(':disabled')).to.be.true
      })
    })

    describe('when bunsenStore.disabled is false', function () {
      beforeEach(function () {
        rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
        this.set('bunsenStore.disabled', false)
      })

      it('disables input', function () {
        const $input = rootNode.find('.frost-select input')
        expect($input.is(':disabled')).to.be.false
      })
    })

    it('has correct classes', function () {
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      expect(rootNode).to.have.class('frost-bunsen-input-select')
    })

    it('has correct enum of values', function () {
      props.bunsenModel.enum = ['foo', 'bar', 'fitz', 'batz']
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      _.forEach(props.bunsenModel.enum, (value) => {
        const isPresent = $(rootNode).text().indexOf(value) !== -1
        expect(isPresent).to.eql(true)
      })
    })

    describe('when query dependency is met', function () {
      beforeEach(function () {
        props.bunsenModel = {
          modelType: 'resource',
          labelAttribute: 'label',
          valueAttribute: 'id',
          query: {
            resourceTypeId: '${foo.bar.someOtherProp}',
            q: 'domainId:${domainId}'
          }
        }
        rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      })

      it('enables the input', function () {
        expect(rootNode.find('.frost-select input').prop('disabled')).to.equal(false)
      })

      it('gets async values per query instructions', function () {
        const expected = ['Resource 2']
        expect($(rootNode).text().indexOf(expected[0]) !== -1).to.eql(true)
        expect($(rootNode).find('li').length).to.equal(expected.length)
      })
    })

    describe('when query dependency for value is not met', function () {
      beforeEach(function () {
        props.bunsenModel = {
          modelType: 'resource',
          labelAttribute: 'label',
          valueAttribute: 'id',
          query: {
            resourceTypeId: '${foo.bar.someOtherProp}',
            q: 'domainId:${domainId}'
          }
        }
        props.bunsenStore = Ember.Object.create({
          formValue: {
            domainId: '',
            foo: {
              bar: {
                someOtherProp: 'helloThere'
              }
            }
          }
        })
        rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      })

      it('disables the input', function () {
        expect(rootNode.find('.frost-select input').prop('disabled')).to.equal(true)
      })

      it('does not fetch data', function () {
        expect(props.dbStore.query.called).to.not.be.ok
      })
    })

    describe('when query dependency for key is not met', function () {
      beforeEach(function () {
        props.bunsenModel = {
          modelType: 'resource',
          labelAttribute: 'label',
          valueAttribute: 'id',
          query: {
            q: '${domainType}:${domainId}'
          }
        }
        props.bunsenStore = Ember.Object.create({
          formValue: {
            domainId: 12345
          }
        })
        rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      })

      it('disables the input', function () {
        expect(rootNode.find('.frost-select input').prop('disabled')).to.equal(true)
      })

      it('does not fetch data', function () {
        expect(props.dbStore.query.called).to.not.be.ok
      })
    })

    it('filters locally for enum-based lists', function () {
      props.bunsenModel.enum = ['foo', 'bar', 'fitz', 'batz']
      const expected = ['foo', 'fitz']
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      $(rootNode).find('input[type=text]').val('f').trigger('input')
      expect($(rootNode).text().indexOf(expected[0]) !== -1).to.eql(true)
      expect($(rootNode).find('li').length).to.equal(expected.length)
    })

    it('filters asynchronously for query.p-based lists', function () {
      props.bunsenModel = {
        modelType: 'resource',
        labelAttribute: 'label',
        valueAttribute: 'id',
        query: {
          p: ''
        }
      }
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      $(rootNode).find('input[type=text]').val('resource 1').trigger('input')
      const expected = ['Resource 1']
      expect($(rootNode).text().indexOf(expected[0]) !== -1).to.eql(true)
      expect($(rootNode).find('li').length).to.equal(expected.length)
    })

    it('supports placeholder in cellConfig', function () {
      rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
      const placeholderText = 'Select something already'
      this.set('cellConfig.placeholder', placeholderText)
      expect(rootNode.find('input').attr('placeholder')).to.eql(placeholderText)
    })
  })
})
