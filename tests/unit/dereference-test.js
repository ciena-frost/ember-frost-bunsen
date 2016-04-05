const expect = chai.expect
import _ from 'lodash'
import {beforeEach, describe, it} from 'mocha'
import {default as dereference, getPath} from 'ember-frost-bunsen/dereference'

import cyclical from '../fixtures/cyclical'
import complex from '../fixtures/complex-model'
import refs from '../fixtures/refs'

describe('dereference', () => {
  describe('getPath()', () => {
    let path

    it('throws an error if not prefixed with #/', () => {
      expect(() => {
        getPath('definitions/foo')
      }).to.throw('Invalid reference "definitions/foo" must begin with "#/"')
    })

    it('translates a reference to a path', () => {
      path = getPath('#/definitions/foo')
      expect(path).to.be.equal('definitions.foo')
    })

    it('translates an array reference to a path', () => {
      path = getPath('#/definitions/foo/1/bar')
      expect(path).to.be.equal('definitions.foo.1.bar')
    })
  })

  describe('dereference()', () => {
    let resp

    describe('when same nested definition is used twice', () => {
      let iface, element
      beforeEach(() => {
        resp = dereference(complex)

        // manuall de-reference interface within element
        iface = complex.definitions.interface
        element = _.cloneDeep(complex.definitions.element)
        element.properties.interfaces.items = _.cloneDeep(iface)
      })

      it('does not error', () => {
        expect(resp.errors.length).to.be.equal(0)
      })

      it('dereferences host', () => {
        const host = resp.schema.properties.network.properties.host
        expect(host).deep.equal(element)
      })

      it('dereferences firewall', () => {
        const firewall = resp.schema.properties.network.properties.firewall
        expect(firewall).deep.equal(element)
      })
    })

    describe('when expanding cyclical references', () => {
      beforeEach(() => {
        resp = dereference(cyclical)
      })

      it('returns proper error', () => {
        const pathSuffix = 'properties/interfaces/items/properties/nestedInterface/$ref'
        const path1 = `#/properties/network/properties/host/${pathSuffix}`
        const path2 = `#/properties/network/properties/firewall/${pathSuffix}`
        const message = 'Cycle detected trying to dereference \'#/definitions/interface\''

        expect(resp.errors).deep.equal([
          {
            path: path1,
            message
          },
          {
            path: path2,
            message
          }
        ])
      })

      it('populates a list of dereferenced refs', () => {
        expect(resp.refs).deep.equal([
          '#/definitions/element',
          '#/definitions/interface'
        ])
      })
    })

    describe('when using the same reference in sybling objects', () => {
      beforeEach(() => {
        resp = dereference(refs)
      })

      it('is valid', () => {
        expect(resp.errors).deep.equal([])
      })
    })
  })
})
