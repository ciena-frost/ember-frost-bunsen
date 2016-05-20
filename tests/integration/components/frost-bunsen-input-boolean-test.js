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
      cellConfig: Ember.Object.create({}),
      model: {},
      onChange () {},
      store: Ember.Object.create({}),
      value: true
    }

    rootNode = renderWithProps(this, 'frost-bunsen-input-boolean', props)
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-input-boolean')
  })

  describe('when store.disabled is true', function () {
    beforeEach(function () {
      this.set('store.disabled', true)
    })

    it('disables input', function () {
      const $input = rootNode.find('.frost-checkbox input')
      expect($input.is(':disabled')).to.be.true
    })
  })

  describe('when store.disabled is false', function () {
    beforeEach(function () {
      this.set('store.disabled', false)
    })

    it('disables input', function () {
      const $input = rootNode.find('.frost-checkbox input')
      expect($input.is(':disabled')).to.be.false
    })
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
