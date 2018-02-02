import {getChangeSet} from 'bunsen-core/change-utils'
import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-cell', function () {
  setupComponentTest('frost-bunsen-cell', {
    unit: true
  })

  let component, sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      errors: {},
      onChange: sandbox.spy(),
      onError: sandbox.spy()
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('showSection()', function () {
    it('returns true when model is array and no renderer is provided', function () {
      component.setProperties({
        bunsenModel: {
          type: 'array'
        }
      })
      expect(component.get('showSection')).to.equal(true)
    })

    it('returns false when model is array and renderer is provided', function () {
      component.setProperties({
        bunsenModel: {
          type: 'array'
        },
        cellConfig: {
          renderer: {}
        }
      })
      expect(component.get('showSection')).to.equal(false)
    })
  })

  describe('renderLabel()', function () {
    describe('no cellConfig or label value', function () {
      it('should return expected value', function () {
        expect(component.get('renderLabel')).to.equal('')
      })
    })

    describe('cellConfig.hideLable = true', function () {
      beforeEach(function () {
        component.setProperties({
          cellConfig: {
            hideLabel: true
          }
        })
      })

      it('should return expected value', function () {
        expect(component.get('renderLabel')).to.equal(null)
      })
    })

    describe('label has only first character capitalized', function () {
      describe('all uppercase', function () {
        beforeEach(function () {
          component.setProperties({
            cellConfig: {
              label: 'ALL CAPS'
            }
          })
        })

        it('should return expected value', function () {
          expect(component.get('renderLabel')).to.equal('ALL CAPS')
        })
      })

      describe('all lowercase', function () {
        beforeEach(function () {
          component.setProperties({
            cellConfig: {
              label: 'all lowercase'
            }
          })
        })

        it('should return expected value', function () {
          expect(component.get('renderLabel')).to.equal('All lowercase')
        })
      })

      describe('mixed case', function () {
        beforeEach(function () {
          component.setProperties({
            cellConfig: {
              label: 'aLL cAps'
            }
          })
        })

        it('should return expected value', function () {
          expect(component.get('renderLabel')).to.equal('ALL cAps')
        })
      })

      describe('first character of each word capitalized', function () {
        beforeEach(function () {
          component.setProperties({
            cellConfig: {
              label: 'First Character'
            }
          })
        })

        it('should return expected value', function () {
          expect(component.get('renderLabel')).to.equal('First Character')
        })
      })

      describe('acronym', function () {
        beforeEach(function () {
          component.setProperties({
            cellConfig: {
              label: 'IP Addresses'
            }
          })
        })

        it('should return expected value', function () {
          expect(component.get('renderLabel')).to.equal('IP Addresses')
        })
      })
    })
  })

  describe('didRecieveAttrs', function () {
    let value
    beforeEach(function () {
      value = {
        foo: 'bar',
        baz: 'qux'
      }
      component.setProperties({
        value,
        propagatedValue: {},
        propagatedValueChangeSet: null
      })
    })

    describe('when new changeset is detected', function () {
      beforeEach(function () {
        let valueChangeSet = getChangeSet({}, {
          foo: 'bar'
        })
        component.setProperties({
          _oldValueChangeSet: new Map(),
          valueChangeSet
        })
      })

      describe('and changeset includes changes for this cell tree', function () {
        beforeEach(function () {
          let cellConfig = {
            __dependency__: 'root.foo'
          }
          component.setProperties({
            cellConfig,
            _oldCellConfig: cellConfig
          })
          component.didReceiveAttrs()
        })

        it('should update the propagatedValue', function () {
          expect(component.get('propagatedValue')).to.equal(value)
        })
      })

      describe('and changeset does not include changes for this tree', function () {
        beforeEach(function () {
          let cellConfig = {
            __dependency__: 'root.baz'
          }
          component.setProperties({
            cellConfig,
            _oldCellConfig: cellConfig
          })
          component.didReceiveAttrs()
        })

        it('should not update the propagatedValue', function () {
          expect(component.get('propagatedValue')).to.eql({})
        })
      })
    })

    describe('when no new changeset is detected', function () {
      beforeEach(function () {
        let _oldValueChangeSet = getChangeSet({}, {
          foo: 'bar'
        })
        component.setProperties({
          _oldValueChangeSet,
          valueChangeSet: _oldValueChangeSet
        })
      })

      describe('when old changeset includes changes for this cell tree', function () {
        beforeEach(function () {
          let cellConfig = {
            __dependency__: 'root.foo'
          }
          component.setProperties({
            cellConfig,
            _oldCellConfig: cellConfig
          })
          component.didReceiveAttrs()
        })

        it('should not update the propagatedValue', function () {
          expect(component.get('propagatedValue')).to.eql({})
        })
      })

      describe('when old changeset does not include changes for this tree', function () {
        beforeEach(function () {
          let cellConfig = {
            __dependency__: 'root.baz'
          }
          component.setProperties({
            cellConfig,
            _oldCellConfig: cellConfig
          })
          component.didReceiveAttrs()
        })

        it('should not update the propagatedValue', function () {
          expect(component.get('propagatedValue')).to.eql({})
        })
      })
    })
  })
})
