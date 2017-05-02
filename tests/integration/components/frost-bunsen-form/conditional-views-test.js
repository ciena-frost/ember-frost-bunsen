import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

function renderWithValue (context, value) {
  context.set('value', value)
  context.render(hbs`{{frost-bunsen-detail
    bunsenModel=bunsenModel
    bunsenView=bunsenView
    hook=hook
    value=value
  }}`)
}

describe('Integration: frost-bunsen-detail / views with conditions', function () {
  setupComponentTest('detail views with conditions', {
    integration: true
  })

  beforeEach(function () {
    this.setProperties({
      hook: 'ember-frost-bunsen-detail',
      bunsenModel: {
        properties: {
          tagType: {
            type: 'string'
          },
          tag: {
            type: 'string'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cellDefinitions: {
          tagType: {
            model: 'tagType'
          },
          tag: {
            model: 'tag',
            conditions: [{
              if: [{
                'tagType': {equals: 'tagged'}
              }]
            }]
          }
        },
        cells: [{
          children: [
            {extends: 'tagType'},
            {extends: 'tag'}
          ]
        }],
        type: 'detail',
        version: '2.0'
      }
    })

    return wait()
  })

  it('hides cells when conditions are not met', function () {
    renderWithValue(this, {
      tagType: 'untagged'
    })
    return wait().then(() => {
      const $inputs = this.$('.frost-bunsen-input-static')
      expect($inputs).to.have.length(1)
    })
  })

  it('shows cells when conditions are met', function () {
    renderWithValue(this, {
      tagType: 'tagged',
      tag: 'some-tag'
    })
    return wait().then(() => {
      const $inputs = this.$('.frost-bunsen-input-static')
      expect($inputs).to.have.length(2)
    })
  })
})
