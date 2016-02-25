const expect = chai.expect
import {afterEach, beforeEach, describe, it} from 'mocha'
import PropTypesMixin, {PropTypes, helpers} from 'ember-frost-bunsen/mixins/prop-types'

describe('PropTypesMixin', function () {
  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()

    sandbox.stub(Ember, 'getOwner').returns({
      __container__: {
        lookupFactory () {
          return {
            environment: 'tests'
          }
        }
      }
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('propTypes not defined', function () {
    beforeEach(function () {
      sandbox.spy(helpers, 'validateProperty')
      const Component = Ember.Component.extend(PropTypesMixin)
      Component.create()
    })

    it('does not call validateProperty', function () {
      expect(helpers.validateProperty.called).to.be.false
    })
  })

  describe('propTypes defined but empty', function () {
    beforeEach(function () {
      sandbox.spy(helpers, 'validateProperty')
      const Component = Ember.Component.extend(PropTypesMixin, {
        propTypes: {}
      })
      Component.create()
    })

    it('does not call validateProperty', function () {
      expect(helpers.validateProperty.called).to.be.false
    })
  })

  describe('propTypes defined but unknown type', function () {
    beforeEach(function () {
      sandbox.spy(Ember.Logger, 'warn')
      sandbox.spy(helpers, 'validateProperty')
      const Component = Ember.Component.extend(PropTypesMixin, {
        propTypes: {
          foo: PropTypes.doesNotExist
        }
      })
      Component.create()
    })

    it('does not call validateProperty', function () {
      expect(helpers.validateProperty.called).to.be.false
    })

    it('logs warning message', function () {
      expect(Ember.Logger.warn.called).to.be.true
    })
  })

  describe('propTypes defined with validations present', function () {
    beforeEach(function () {
      sandbox.spy(helpers, 'validateProperty')
      const Component = Ember.Component.extend(PropTypesMixin, {
        propTypes: {
          foo: PropTypes.string,
          bar: PropTypes.number
        }
      })
      Component.create()
    })

    it('calls validateProperty for each propType', function () {
      expect(helpers.validateProperty.called).to.be.true
    })
  })
})
