const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../../utils/template'

describeComponent(...integrationTestContext('frost-bunsen-input-boolean'), function () {
  let rootNode

  beforeEach(function () {
    const props = {
      bunsenId: 'enabled',
      cellConfig: Ember.Object.create({}),
      model: {},
      'on-change': () => {},
      store: Ember.Object.create({}),
      state: Ember.Object.create({value: true})
    }

    rootNode = renderWithProps(this, 'frost-bunsen-input-boolean', props)
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-input-boolean')
  });

  [true, false].forEach((initialValue) => {
    describe(`when value is ${initialValue}`, function () {
      beforeEach(function () {
        this.set('state.value', initialValue)
      })

      it('informs consumer of changes via on-change property', function (done) {
        this.set('on-change', function (e) {
          expect(e).to.deep.equal({
            id: 'enabled',
            value: !initialValue
          })
          done()
        })

        rootNode.find('input').click()
      })
    })
  })
})
