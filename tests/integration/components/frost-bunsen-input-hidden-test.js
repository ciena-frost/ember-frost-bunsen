/**
 * Integration test for frost-bunsen-input-hidden component
 */
import {expect} from 'chai'
import Ember from 'ember'
const {run} = Ember
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe} from 'mocha'
import sinon from 'sinon'
import {integrationTestContext} from 'dummy/tests/helpers/template'

/**
 * Helper to render the input with default property names
 * @param {Object} ctx - the mocha test context
 */
function render (ctx) {
  ctx.render(hbs`{{frost-bunsen-input-hidden
    bunsenId=bunsenId
    bunsenModel=bunsenModel
    bunsenView=bunsenView
    cellConfig=cellConfig
    onChange=onChange
    registerForFormValueChanges=registerForFormValueChanges
    value=value
  }}`)
}

describeComponent(...integrationTestContext('frost-bunsen-input-hidden'), function () {
  let sandbox, onChange
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    onChange = sandbox.stub()
    this.setProperties({
      bunsenId: 'name',
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      onChange,
      registerForFormValueChanges () {},
      value: ''
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when a default is given', function () {
    describe('and nothing is set yet', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenModel: {
            type: 'string',
            default: 'Hal Jordan'
          },
          value: ''
        })

        render(this)
      })

      it('should render an empty div', function () {
        expect(this.$('div *')).to.have.length(0)
      })

      it('should fire onChange with the default', function (done) {
        // give it a chance to trigger the onchange
        run.later(() => {
          expect(onChange.lastCall.args).to.be.eql(['name', 'Hal Jordan'])
          done()
        })
      })
    })

    describe('and the default is already set', function () {
      beforeEach(function () {
        this.setProperties({
          bunsenModel: {
            type: 'string',
            default: 'Hal Jordan'
          },
          value: 'Hal Jordan'
        })

        render(this)
      })

      it('should render an empty div', function () {
        expect(this.$('div *')).to.have.length(0)
      })

      it('should not fire onChange', function (done) {
        // give it a chance to trigger the onchange
        run.later(() => {
          expect(onChange.called).to.be.equal(false)
          done()
        })
      })
    })
  })

  describe('when a valueRef is given', function () {
    describe('and nothing is set yet', function () {
      beforeEach(function () {
        this.setProperties({
          cellConfig: {
            renderer: {
              valueRef: 'nickname'
            }
          },
          bunsenStore: Ember.Object.create({
            formValue: {
              name: '',
              nickname: 'Green Lantern'
            }
          }),
          value: ''
        })

        render(this)
      })

      it('should render an empty div', function () {
        expect(this.$('div *')).to.have.length(0)
      })

      it('should fire onChange with the default', function (done) {
        // give it a chance to trigger the onchange
        run.later(() => {
          expect(onChange.lastCall.args).to.be.eql(['name', 'Green Lantern'])
          done()
        })
      })
    })

    describe('and that value is already set', function () {
      beforeEach(function () {
        this.setProperties({
          cellConfig: {
            renderer: {
              valueRef: 'nickname'
            }
          },
          bunsenStore: Ember.Object.create({
            formValue: {
              name: 'Green Lantern',
              nickname: 'Green Lantern'
            }
          }),
          value: 'Green Lantern'
        })

        render(this)
      })

      it('should render an empty div', function () {
        expect(this.$('div *')).to.have.length(0)
      })

      it('should not fire onChange', function (done) {
        // give it a chance to trigger the onchange
        run.later(() => {
          expect(onChange.called).to.be.equal(false)
          done()
        })
      })
    })
  })
})
