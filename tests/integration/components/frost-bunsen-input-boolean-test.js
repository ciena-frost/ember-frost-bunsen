import {expect} from 'chai'
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'

describeComponent(...integrationTestContext('frost-bunsen-input-boolean'), function () {
  let rootNode

  beforeEach(function () {
    const props = {
      bunsenId: 'enabled',
      bunsenModel: {},
      bunsenStore: Ember.Object.create({}),
      cellConfig: Ember.Object.create({}),
      onChange () {},
      value: true
    }

    rootNode = renderWithProps(this, 'frost-bunsen-input-boolean', props)
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-input-boolean')
  })

  ;[true, false].forEach((initialValue) => {
    describe(`when value is ${initialValue}`, function () {
      beforeEach(function () {
        this.set('value', initialValue)
      })

      it('informs consumer of changes via onChange property', function (done) {
        this.set('onChange', function (id, value) {
          expect(id).to.equal('enabled')
          expect(value).to.equal(!initialValue)
          done()
        })

        rootNode.find('input').click()
      })
    })
  })
})
