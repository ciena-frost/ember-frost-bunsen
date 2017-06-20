import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {describe, it} from 'mocha'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

const bunsenModel = {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      title: 'Full name',
      properties: {
        first: {
          type: 'string'
        },
        last: {
          type: 'string'
        }
      },
      required: ['first', 'last']
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          street: {
            type: 'string'
          },
          city: {
            type: 'string'
          },
          state: {
            type: 'string'
          },
          zip: {
            type: 'string'
          }
        },
        required: ['street', 'city', 'state', 'zip']
      },
      minItems: 1
    }
  },
  required: ['name', 'addresses']
}

const bunsenView = {
  version: '2.0',
  type: 'form',
  cells: [
    {
      label: 'Name',
      extends: 'name'
    },
    {
      label: 'Addresses',
      extends: 'addresses'
    }
  ],
  cellDefinitions: {
    addr: {
      children: [
        {model: 'street'},
        {model: 'city'},
        {model: 'state'},
        {model: 'zip'}
      ]
    },
    addresses: {
      children: [
        {
          model: 'addresses',
          arrayOptions: {
            itemCell: {
              extends: 'addr',
              label: 'Address'
            }
          }
        }
      ]
    },
    name: {
      children: [
        {model: 'name.first'},
        {model: 'name.last'}
      ]
    }
  }
}

describe('Integration: Component / frost-bunsen-form / array in tab', function () {
  describe('when adding to arrays', function () {
    setupFormComponentTest({
      bunsenModel,
      bunsenView,
      value: {}
    })
    it('does not jump tabs', function () {
      return wait().then(() => {
        this.$('.frost-tab button').last().click()
        return wait()
      }).then(() => {
        this.$('.frost-bunsen-array-container button').click()
        return wait()
      }).then(() => {
        this.$('.frost-bunsen-array-container button')
        expect(this.$('.frost-bunsen-array-container')).to.have.length(1)
      })
    })
  })
})
