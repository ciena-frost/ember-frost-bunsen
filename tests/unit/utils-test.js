const expect = chai.expect
import {describe, it} from 'mocha'
import * as utils from 'ember-frost-bunsen/utils'

describe('utils', () => {
  describe('getModelPath()', () => {
    it('handles top-level properties', () => {
      expect(utils.getModelPath('fooBar')).to.be.equal('properties.fooBar')
    })

    it('handles nested properties', () => {
      expect(utils.getModelPath('foo.bar.baz')).to.be.equal('properties.foo.properties.bar.properties.baz')
    })

    it('handles invalid trailing dot reference', () => {
      expect(utils.getModelPath('foo.bar.')).to.be.equal(undefined)
    })

    it('handles invalid leading dot reference', () => {
      expect(utils.getModelPath('.foo.bar')).to.be.equal(undefined)
    })

    it('handles model with dependency', () => {
      const expected = 'dependencies.useEft.properties.routingNumber'
      expect(utils.getModelPath('routingNumber', 'useEft')).to.be.equal(expected)
    })

    it('handles model with dependency', () => {
      const expected = 'properties.paymentInfo.dependencies.useEft.properties.routingNumber'
      expect(utils.getModelPath('paymentInfo.routingNumber', 'paymentInfo.useEft')).to.be.equal(expected)
    })
  })

  describe('orch filter processing', () => {
    const objToMine = {
      foo: 'bar',
      fizz: {
        foo: 'bar',
        futz: [
          {
            foo: 'bar'
          },
          {
            fizz: 'buzz',
            farz: 'barz'
          }
        ],
        fatz: 'batz'
      }
    }

    it('finds absolute paths in a value object', () => {
      const expected = 'bar'
      expect(utils.findValue(objToMine, 'fizz.futz.[0].foo')).to.equal(expected)
    })

    it('finds parent paths in the object', () => {
      const startPath = 'fizz.futz.[1].fizz'
      let valuePath = '../../fatz'
      let expected = 'batz'
      expect(utils.findValue(objToMine, valuePath, startPath)).to.equal(expected)
      valuePath = '../[0].foo'
      expected = 'bar'
      expect(utils.findValue(objToMine, valuePath, startPath)).to.equal(expected)
    })

    it('finds sibling paths in the object', () => {
      const startPath = 'fizz.futz.[1].fizz'
      const valuePath = './farz'
      const expected = 'barz'
      expect(utils.findValue(objToMine, valuePath, startPath)).to.equal(expected)
    })

    it('parses and gets a variable in an orch-style query param', () => {
      let filterValue = '${fizz.futz[0].foo}'
      const expected = 'bar'
      expect(utils.parseOrchFilterVariables(objToMine, filterValue)).to.equal(expected)
      filterValue = 'fizzBuzz'
      expect(utils.parseOrchFilterVariables(objToMine, filterValue)).to.equal(filterValue)
    })

    it('populates variables in orch-style query params ', () => {
      let queryParamFilter = 'something:${fizz.futz[0].foo}'
      const expected = 'something:bar'
      expect(utils.parseOrchFilters(objToMine, queryParamFilter)).to.equal(expected)
    })

    it('properly configures an Orchestrate query object', () => {
      let startPath = 'fizz.futz.[0].foo'
      let query = {
        resourceType: 'something.this.that',
        q: 'label:thing,someId:${../[1].fizz}',
        p: 'orchState:ac,someOtherId:${foo}'
      }
      let expected = {
        resourceType: 'something.this.that',
        q: 'label:thing,someId:buzz',
        p: 'orchState:ac,someOtherId:bar'
      }
      let actual = utils.createOrchQuery(objToMine, query, startPath)
      expect(JSON.stringify(actual)).to.equal(JSON.stringify(expected))
    })
  })
})
