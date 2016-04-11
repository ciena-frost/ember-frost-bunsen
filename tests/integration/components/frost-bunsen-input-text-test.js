const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'

describeComponent(...integrationTestContext('frost-bunsen-input-text'), function () {
  let rootNode

  beforeEach(function () {
    let props = {
      bunsenId: 'name',
      cellConfig: Ember.Object.create({}),
      model: {},
      onChange () {},
      store: Ember.Object.create({})
    }
    rootNode = renderWithProps(this, 'frost-bunsen-input-text', props)

    rootNode = this.$('> div')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-input-text')
  })

  it('calls onChange callback with id and value when the value is changed', function (done) {
    let setVal = 'Test string value'

    this.set('onChange', function (id, value) {
      expect(id).to.equal('name')
      expect(value).to.equal(setVal)
      done()
    })

    var input = rootNode.find('input')
    input.val(setVal)
    input.trigger('input')
  })
})
