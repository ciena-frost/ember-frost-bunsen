import {expect} from 'chai'
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  bunsenId: 'age',
  cellConfig: Ember.Object.create({}),
  model: {},
  onChange () {},
  store: Ember.Object.create({})
}

function tests (ctx) {
  describe('when store.disabled is true', function () {
    beforeEach(function () {
      this.set('store.disabled', true)
    })

    it('disables input', function () {
      const $input = ctx.rootNode.find('.frost-text input')
      expect($input.is(':disabled')).to.be.true
    })
  })

  describe('when store.disabled is false', function () {
    beforeEach(function () {
      this.set('store.disabled', false)
    })

    it('disables input', function () {
      const $input = ctx.rootNode.find('.frost-text input')
      expect($input.is(':disabled')).to.be.false
    })
  })

  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-input-number')
  })

  it('calls onChange callback with id and value when the value is changed', function (done) {
    let setVal = 146623462

    this.set('onChange', function (id, value) {
      expect(id).to.equal('age')
      expect(value).to.equal(setVal)
      done()
    })

    const input = ctx.rootNode.find('input')

    input.val(setVal)
    input.trigger('input')
  })
}

setupComponentTest('frost-bunsen-input-number', props, tests)
